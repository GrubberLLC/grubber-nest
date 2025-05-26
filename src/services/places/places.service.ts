import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service.js';
import { getErrorMessage } from '../../types/supabase.types.js';
import {
  PlaceWithPhotosResponse,
  FetchRestaurantsProps,
  GooglePlaceDetailsResult,
} from '../../types/places.types.js';
import { convertGooglePlacesToSupabasePlaces } from '../../utils/places.utils.js';
import { GooglePlacesApiService } from '../google-places/google-places.service.js';
import { PlacePhotoService } from '../place-photos/place-photos.service.js';
import { SupabasePlaceDataService } from '../supabase-place-data/supabase-place-data.service.js';
import { PlaceIdManagementService } from '../place-id-management/place-id-management.service.js';

const GOOGLE_PLACES_API_ACTIVE = true;

@Injectable()
export class PlacesService {
  private readonly logger = new Logger(PlacesService.name);

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly googlePlacesApiService: GooglePlacesApiService,
    private readonly placePhotoService: PlacePhotoService,
    private readonly supabasePlaceDataService: SupabasePlaceDataService,
    private readonly placeIdManagementService: PlaceIdManagementService,
  ) {}

  private async _fetchAndPrepareGooglePlaceData(
    searchString: string | undefined,
    coordinates: { latitude: number; longitude: number },
  ): Promise<{
    placesDetails: GooglePlaceDetailsResult[];
    placeIdMap: Map<string, string>;
    supabasePlacesToInsert: PlaceWithPhotosResponse[];
  } | null> {
    this.logger.log(
      `Fetching from Google Places for: '${searchString || 'any'}' near ${coordinates.latitude},${coordinates.longitude}`,
    );
    const placesDetails: GooglePlaceDetailsResult[] =
      await this.googlePlacesApiService
        .fetchNearbyRestaurantsWithDetails(
          searchString || 'restaurant',
          coordinates,
        )
        .catch((error) => {
          this.logger.error(
            `GooglePlacesApiService.fetchNearbyRestaurantsWithDetails failed: ${getErrorMessage(error)}`,
          );
          return [];
        });

    if (!placesDetails || placesDetails.length === 0) {
      this.logger.log('No place details returned from Google Places API.');
      return null;
    }

    const placeIdMap = new Map<string, string>();
    for (const detail of placesDetails) {
      const placeId =
        await this.placeIdManagementService.getOrCreateInternalPlaceId(detail);
      if (detail.id) {
        placeIdMap.set(detail.id, placeId);
      }
    }

    const supabasePlacesToInsert = convertGooglePlacesToSupabasePlaces(
      placesDetails,
      placeIdMap,
    );

    if (supabasePlacesToInsert.length > 0) {
      await this.supabasePlaceDataService.insertPlaces(supabasePlacesToInsert);
    }

    for (const placeDetail of placesDetails) {
      const internalPlaceId = placeIdMap.get(placeDetail.id);
      if (internalPlaceId) {
        await this.placePhotoService.queuePhotoProcessingForPlace(
          placeDetail,
          internalPlaceId,
        );
      }
    }
    return { placesDetails, placeIdMap, supabasePlacesToInsert };
  }

  /**
   * Fetches place records from the Supabase 'Places' table by their internal IDs.
   * Includes fallback logic to use provided core data if the database fetch fails or returns empty.
   * @param placeIdsToFetch An array of internal place IDs to fetch.
   * @param fallbackData An array of PlaceWithPhotosResponse (or core data) to use as fallback.
   * @returns A promise that resolves to an array of PlaceWithPhotosResponse from the database or fallbackData.
   */
  private async _fetchStoredPlacesByIds(
    placeIdsToFetch: string[],
    fallbackData: PlaceWithPhotosResponse[],
  ): Promise<PlaceWithPhotosResponse[]> {
    if (placeIdsToFetch.length === 0) {
      return [];
    }
    const supabase = this.supabaseService.getClient();
    const { data: placesData, error: fetchError } = await supabase
      .from('Places')
      .select('*')
      .in('place_id', placeIdsToFetch);

    if (fetchError) {
      this.logger.error(
        `Failed to fetch newly inserted/updated places by IDs: ${fetchError.message}`,
      );
    }
    if (placesData && placesData.length > 0) {
      return placesData as PlaceWithPhotosResponse[];
    }

    if (fallbackData.length > 0) {
      this.logger.warn(
        'Could not fetch complete place details from DB after insert/upsert. Using core data for immediate response (may lack some fields).',
      );
      return fallbackData.map((corePlace) => ({
        ...(corePlace as unknown as PlaceWithPhotosResponse),
        photos: [],
      }));
    }
    return [];
  }

  /**
   * Main public method to fetch and cache restaurants nearby.
   * It first checks the local Supabase DB. If enough places are found, it returns them with photos.
   * Otherwise, it fetches data from Google Places API, processes, stores, and then returns the data.
   * Photo information is augmented by PlacePhotoService.
   * @param props Object containing coordinates (latitude, longitude) and an optional searchString.
   * @returns A promise that resolves to an array of PlaceWithPhotosResponse, with photos ready for display.
   */
  public async fetchAndCacheRestaurantsNearby({
    searchString,
    coordinates,
  }: FetchRestaurantsProps): Promise<PlaceWithPhotosResponse[]> {
    // SUPABASE DB FLOW

    // fetch places from supabase places table
    const dbPlaces = await this.supabasePlaceDataService.getClosestPlaces(
      coordinates.latitude,
      coordinates.longitude,
      searchString,
    );

    // check if there are more than 15 places
    const thresholdMet = Array.isArray(dbPlaces) && dbPlaces.length >= 15;

    // if there are, return the places with photos
    if (thresholdMet || !GOOGLE_PLACES_API_ACTIVE) {
      this.logger.log(
        `DB count is ${dbPlaces.length} (threshold 15). Returning from DB then attaching photos.`,
      );

      // get photos for the places
      const placesWithPhotos =
        await this.placePhotoService.getAugmentedPhotosForPlaces(dbPlaces);
      return placesWithPhotos;
    } else {
      // GOOGLE API FLOW
      this.logger.log(
        `DB count is ${dbPlaces.length} (threshold 15). Fetching from Google Places API.`,
      );

      // fetch places from google places api
      const preparedData = await this._fetchAndPrepareGooglePlaceData(
        searchString,
        coordinates,
      );

      // if there is an error, return an empty array
      if (!preparedData) {
        return [];
      }

      // get the place ids to fetch
      const placeIdsToFetch = preparedData.supabasePlacesToInsert
        .map((p) => p.place_id)
        .filter((id): id is string => id !== undefined);

      // fetch the places from the database
      const completePlacesFromDb = await this._fetchStoredPlacesByIds(
        placeIdsToFetch,
        preparedData.supabasePlacesToInsert,
      );

      // get the photos for the places from the database
      const finalResponsePlaces =
        await this.placePhotoService.getAugmentedPhotosForPlaces(
          completePlacesFromDb,
          preparedData.placesDetails,
        );

      // return the places with photos
      return finalResponsePlaces;
    }
  }
}
