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
import { MAX_PLACES_PER_QUERY } from '../../constants/places.constants.js';

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
    this.logger.verbose(
      `[TIMING] _fetchAndPrepareGooglePlaceData: START for '${searchString || 'any'}' near ${coordinates.latitude},${coordinates.longitude}`,
    );

    let startTime = Date.now();
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
    this.logger.verbose(
      `[TIMING] _fetchAndPrepareGooglePlaceData: fetchNearbyRestaurantsWithDetails took ${Date.now() - startTime}ms. Found ${placesDetails.length} places.`,
    );

    if (!placesDetails || placesDetails.length === 0) {
      this.logger.verbose(
        '[TIMING] _fetchAndPrepareGooglePlaceData: No place details returned. END',
      );
      return null;
    }

    const placeIdMap = new Map<string, string>();
    const placeIdManagementStartTime = Date.now();

    const placeIdPromises = placesDetails
      .filter((detail) => detail.id) // Process only details with an ID
      .map(async (detail) => {
        try {
          const internalId = await (
            this.placeIdManagementService.getOrCreateInternalPlaceId as (
              d: typeof detail,
            ) => Promise<string>
          )(detail);
          return { googlePlaceId: detail.id, internalId }; // detail.id is non-null here due to the filter
        } catch (error) {
          this.logger.error(
            `Error in getOrCreateInternalPlaceId for Google ID ${detail.id}: ${getErrorMessage(error)}`,
          );
          return null; // Indicate failure for this specific place
        }
      });

    const placeIdResults = await Promise.all(placeIdPromises);
    placeIdResults.forEach((result) => {
      if (result && result.googlePlaceId && result.internalId) {
        placeIdMap.set(result.googlePlaceId, result.internalId);
      }
    });

    this.logger.verbose(
      `[TIMING] _fetchAndPrepareGooglePlaceData: Parallel getOrCreateInternalPlaceId calls took ${Date.now() - placeIdManagementStartTime}ms. Mapped ${placeIdMap.size} IDs.`,
    );

    startTime = Date.now();
    const supabasePlacesToInsert = convertGooglePlacesToSupabasePlaces(
      placesDetails,
      placeIdMap, // Use the populated map
    );
    this.logger.verbose(
      `[TIMING] _fetchAndPrepareGooglePlaceData: convertGooglePlacesToSupabasePlaces took ${Date.now() - startTime}ms`,
    );

    if (supabasePlacesToInsert.length > 0) {
      startTime = Date.now();
      await this.supabasePlaceDataService.insertPlaces(supabasePlacesToInsert);
      this.logger.verbose(
        `[TIMING] _fetchAndPrepareGooglePlaceData: insertPlaces took ${Date.now() - startTime}ms for ${supabasePlacesToInsert.length} places.`,
      );
    }

    const photoQueueingStartTime = Date.now();
    const photoQueuePromises = placesDetails.map(async (placeDetail) => {
      const internalPlaceId = placeIdMap.get(placeDetail.id);
      if (internalPlaceId && placeDetail.id) {
        try {
          await (
            this.placePhotoService.queuePhotoProcessingForPlace as (
              pd: typeof placeDetail,
              ipId: string,
            ) => Promise<void>
          )(placeDetail, internalPlaceId);
        } catch (error) {
          this.logger.error(
            `Error in queuePhotoProcessingForPlace for Google ID ${placeDetail.id}, Internal ID ${internalPlaceId}: ${getErrorMessage(error)}`,
          );
          // Decide if one failure should stop all, or just log and continue
        }
      }
    });
    await Promise.all(photoQueuePromises);
    this.logger.verbose(
      `[TIMING] _fetchAndPrepareGooglePlaceData: Parallel queuePhotoProcessingForPlace calls took ${Date.now() - photoQueueingStartTime}ms`,
    );

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
    const overallStartTime = Date.now();
    this.logger.verbose(
      `[TIMING] _fetchStoredPlacesByIds: START for ${placeIdsToFetch.length} IDs.`,
    );
    if (placeIdsToFetch.length === 0) {
      this.logger.verbose(
        `[TIMING] _fetchStoredPlacesByIds: No IDs to fetch. END`,
      );
      return [];
    }
    const supabase = this.supabaseService.client;
    const startTime = Date.now();
    const { data: placesData, error: fetchError } = await supabase
      .from('Places')
      .select('*')
      .in('place_id', placeIdsToFetch);
    this.logger.verbose(
      `[TIMING] _fetchStoredPlacesByIds: Supabase query took ${Date.now() - startTime}ms. Found ${placesData?.length || 0} places.`,
    );

    if (fetchError) {
      this.logger.error(
        `Failed to fetch newly inserted/updated places by IDs: ${fetchError.message}`,
      );
    }
    if (placesData && placesData.length > 0) {
      this.logger.verbose(
        `[TIMING] _fetchStoredPlacesByIds: END. Total time: ${Date.now() - overallStartTime}ms`,
      );
      return placesData as PlaceWithPhotosResponse[];
    }

    if (fallbackData.length > 0) {
      this.logger.warn(
        'Could not fetch complete place details from DB after insert/upsert. Using core data for immediate response (may lack some fields).',
      );
      this.logger.verbose(
        `[TIMING] _fetchStoredPlacesByIds: END (used fallback). Total time: ${Date.now() - overallStartTime}ms`,
      );
      return fallbackData.map((corePlace) => ({
        ...(corePlace as unknown as PlaceWithPhotosResponse),
        photos: [],
      }));
    }
    this.logger.verbose(
      `[TIMING] _fetchStoredPlacesByIds: END (no data). Total time: ${Date.now() - overallStartTime}ms`,
    );
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
    const overallStartTime = Date.now();
    this.logger.verbose(
      `[TIMING] fetchAndCacheRestaurantsNearby: START for search: '${searchString || 'any'}', coords: ${coordinates.latitude},${coordinates.longitude}`,
    );

    let startTime = Date.now();
    const dbPlaces = await this.supabasePlaceDataService.getClosestPlaces(
      coordinates.latitude,
      coordinates.longitude,
      searchString,
    );
    this.logger.verbose(
      `[TIMING] fetchAndCacheRestaurantsNearby: getClosestPlaces took ${Date.now() - startTime}ms. Found ${dbPlaces?.length || 0} places.`,
    );

    const thresholdMet =
      Array.isArray(dbPlaces) && dbPlaces.length >= MAX_PLACES_PER_QUERY;

    if (thresholdMet || !GOOGLE_PLACES_API_ACTIVE) {
      this.logger.verbose(
        `[TIMING] fetchAndCacheRestaurantsNearby: DB threshold met or Google API inactive. DB count: ${dbPlaces.length}.`,
      );
      startTime = Date.now();
      const placesWithPhotos =
        await this.placePhotoService.getAugmentedPhotosForPlaces(dbPlaces);
      this.logger.verbose(
        `[TIMING] fetchAndCacheRestaurantsNearby: getAugmentedPhotosForPlaces (DB path) took ${Date.now() - startTime}ms`,
      );
      this.logger.verbose(
        `[TIMING] fetchAndCacheRestaurantsNearby: END (DB path). Total time: ${Date.now() - overallStartTime}ms`,
      );
      return placesWithPhotos;
    } else {
      this.logger.verbose(
        `[TIMING] fetchAndCacheRestaurantsNearby: DB threshold NOT met. DB count: ${dbPlaces.length}. Fetching from Google.`,
      );

      startTime = Date.now();
      const preparedData = await this._fetchAndPrepareGooglePlaceData(
        searchString,
        coordinates,
      );
      this.logger.verbose(
        `[TIMING] fetchAndCacheRestaurantsNearby: _fetchAndPrepareGooglePlaceData took ${Date.now() - startTime}ms`,
      );

      if (!preparedData) {
        this.logger.verbose(
          `[TIMING] fetchAndCacheRestaurantsNearby: END (Google path, no prepared data). Total time: ${Date.now() - overallStartTime}ms`,
        );
        return [];
      }

      const placeIdsToFetch = preparedData.supabasePlacesToInsert
        .map((p) => p.place_id)
        .filter((id): id is string => id !== undefined);

      startTime = Date.now();
      const completePlacesFromDb = await this._fetchStoredPlacesByIds(
        placeIdsToFetch,
        preparedData.supabasePlacesToInsert,
      );
      this.logger.verbose(
        `[TIMING] fetchAndCacheRestaurantsNearby: _fetchStoredPlacesByIds took ${Date.now() - startTime}ms`,
      );

      startTime = Date.now();
      const finalResponsePlaces =
        await this.placePhotoService.getAugmentedPhotosForPlaces(
          completePlacesFromDb,
          preparedData.placesDetails,
        );
      this.logger.verbose(
        `[TIMING] fetchAndCacheRestaurantsNearby: getAugmentedPhotosForPlaces (Google path, Option A) took ${Date.now() - startTime}ms`,
      );

      this.logger.verbose(
        `[TIMING] fetchAndCacheRestaurantsNearby: END (Google path). Total time: ${Date.now() - overallStartTime}ms`,
      );
      return finalResponsePlaces;
    }
  }
}
