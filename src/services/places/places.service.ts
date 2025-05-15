import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service.js';
import { getErrorMessage } from '../../types/supabase.types.js';
import {
  GooglePhotoReference,
  SupabasePlace,
  FetchRestaurantsProps,
  GooglePlaceDetailsResult,
} from '../../types/places.types.js';
import {
  convertGooglePlacesToSupabasePlaces,
  getHaversineDistance,
} from '../../utils/places.utils.js';
import { GooglePlacesApiService } from '../google-places/google-places.service.js';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PlacesService {
  private readonly logger = new Logger(PlacesService.name);
  private readonly SEARCH_RADIUS_METERS = 16093.4;

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly googlePlacesApiService: GooglePlacesApiService,
  ) {}

  private async getClosestSupabasePlaces(
    latitude: number,
    longitude: number,
    keyword: string,
  ): Promise<SupabasePlace[]> {
    this.logger.log(
      `Getting closest places from Supabase near lat:${latitude}, long:${longitude}, keyword:${keyword}`,
    );
    try {
      const supabase = this.supabaseService.getClient();
      let query = supabase
        .from('Places')
        .select('*')
        .lte('latitude', latitude + 0.02)
        .gte('latitude', latitude - 0.02)
        .lte('longitude', longitude + 0.02)
        .gte('longitude', longitude - 0.02);

      if (keyword && keyword.trim() !== '') {
        query = query.or(
          `name.ilike.%${keyword}%,description.ilike.%${keyword}%,category.ilike.%${keyword}%`,
        );
      }

      const { data, error } = await query.limit(20);

      if (error) {
        this.logger.error(`Error fetching places from DB: ${error.message}`);
        return [];
      }
      return (data as SupabasePlace[]) || [];
    } catch (error) {
      this.logger.error(
        `Error in getClosestSupabasePlaces: ${getErrorMessage(error)}`,
        error instanceof Error ? error.stack : undefined,
      );
      return [];
    }
  }

  private async insertSupabasePlaces(places: SupabasePlace[]): Promise<void> {
    if (!places || places.length === 0) {
      return;
    }
    try {
      const supabase = this.supabaseService.getClient();
      const { error } = await supabase.from('Places').upsert(places, {
        onConflict: 'place_id',
      });

      if (error) {
        this.logger.error(
          `Error inserting/upserting places to Supabase: ${error.message}`,
        );
      }
    } catch (error) {
      this.logger.error(
        `Exception inserting Supabase places: ${getErrorMessage(error)}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw new InternalServerErrorException(
        'Failed to save place data to database.',
      );
    }
  }

  private async insertPlacePhotos(
    placePhotos: Array<{
      place_id: string;
      imageUrl: string;
    }>,
  ): Promise<void> {
    if (!placePhotos || placePhotos.length === 0) {
      return;
    }

    try {
      const supabase = this.supabaseService.getClient();
      const { error } = await supabase.from('PlacePhotos').upsert(placePhotos, {
        onConflict: 'imageUrl',
        ignoreDuplicates: false,
      });

      if (error) {
        this.logger.error(
          `Error inserting/upserting place photos to Supabase: ${error.message}`,
          error,
        );
      }
    } catch (error) {
      this.logger.error(
        `Exception inserting place photos: ${getErrorMessage(error)}`,
        error instanceof Error ? error.stack : undefined,
      );
    }
  }
  private async _findFuzzyMatchedGrubberId(
    placeName: string,
    placeLat: number,
    placeLng: number,
  ): Promise<string | null> {
    const FUZZY_MATCH_RADIUS_KM = 0.1;
    const supabase = this.supabaseService.getClient();

    const { data: potentialMatches, error: matchError } = await supabase
      .from('Places')
      .select('place_id, name, latitude, longitude')
      .gte('latitude', placeLat - 0.01)
      .lte('latitude', placeLat + 0.01)
      .gte('longitude', placeLng - 0.01)
      .lte('longitude', placeLng + 0.01);

    if (matchError) {
      this.logger.error(
        `Error querying potential matches for fuzzy search: ${matchError.message}`,
      );
      throw new InternalServerErrorException(
        'Failed to query for place matching during fuzzy search.',
      );
    }

    if (!potentialMatches || potentialMatches.length === 0) {
      return null;
    }

    type PotentialMatch = {
      place_id: string;
      name: string;
      latitude: number;
      longitude: number;
    };

    const closeMatches = (potentialMatches as PotentialMatch[]).filter(
      (p: PotentialMatch) => {
        if (
          !p.place_id ||
          !p.name ||
          typeof p.latitude !== 'number' ||
          typeof p.longitude !== 'number'
        ) {
          this.logger.warn(
            'Skipping potential match due to missing or invalid data',
            p,
          );
          return false;
        }
        const distance = getHaversineDistance(
          placeLat,
          placeLng,
          p.latitude,
          p.longitude,
        );
        const namesMatch = p.name.toLowerCase() === placeName.toLowerCase();
        return distance <= FUZZY_MATCH_RADIUS_KM && namesMatch;
      },
    );

    if (closeMatches.length === 1) {
      return closeMatches[0].place_id;
    } else if (closeMatches.length > 1) {
      this.logger.warn(
        `Found ${closeMatches.length} potential fuzzy matches for ${placeName}. Cannot confidently pick one.`,
      );
      return null;
    } else {
      return null;
    }
  }

  private async _getOrCreateGrubberId(
    source: string,
    placeDetails: GooglePlaceDetailsResult,
  ): Promise<string> {
    const supabase = this.supabaseService.getClient();
    const externalId = placeDetails.id;
    const placeNameInput = placeDetails.displayName?.text || placeDetails.name;
    const placeLat = placeDetails.location?.latitude;
    const placeLng = placeDetails.location?.longitude;

    if (
      !externalId ||
      !placeNameInput ||
      placeLat === undefined ||
      placeLng === undefined
    ) {
      this.logger.error(
        `Missing essential details (ID, Name, Lat, Lng) for matching. Source: ${source}`,
        placeDetails,
      );
      throw new InternalServerErrorException(
        'Insufficient place details for ID creation/matching.',
      );
    }
    const placeName: string = placeNameInput;

    this.logger.log(
      `Getting or creating Grubber ID for ${source}:${externalId} (${placeName})`,
    );

    const { data: existingMapping, error: findError } = await supabase
      .from('ExternalPlacesIds')
      .select('id')
      .eq('source', source)
      .eq('external_id', externalId)
      .single();

    if (findError && findError.code !== 'PGRST116') {
      this.logger.error(
        `Error finding Grubber ID for ${source}:${externalId}: ${findError.message}`,
      );
      throw new InternalServerErrorException(
        'Failed to retrieve external ID mapping.',
      );
    }

    if (existingMapping && existingMapping.id) {
      this.logger.log(
        `Found existing Grubber ID via External table: ${existingMapping.id}`,
      );
      return existingMapping.id as string;
    }

    this.logger.log(
      `No direct external mapping. Attempting fuzzy match for: ${placeName}`,
    );
    const matchedGrubberId = await this._findFuzzyMatchedGrubberId(
      placeName,
      placeLat,
      placeLng,
    );

    if (matchedGrubberId) {
      this.logger.log(
        `Linking ${source}:${externalId} to existing Grubber ID ${matchedGrubberId}`,
      );
      const { error: linkError } = await supabase
        .from('ExternalPlacesIds')
        .insert({ id: matchedGrubberId, source, external_id: externalId });

      if (linkError) {
        this.logger.error(
          `Error linking ${source}:${externalId} to existing Grubber ID ${matchedGrubberId}: ${linkError.message}`,
          linkError,
        );
      }
      return matchedGrubberId;
    } else {
      const newGrubberId = uuidv4();
      this.logger.log(
        `Creating new Grubber ID: ${newGrubberId} for ${source}:${externalId}`,
      );
      const { error: insertError } = await supabase
        .from('ExternalPlacesIds')
        .insert({ id: newGrubberId, source, external_id: externalId });

      if (insertError) {
        this.logger.error(
          `Error inserting new Grubber ID mapping for ${source}:${externalId}: ${insertError.message}`,
        );
        throw new InternalServerErrorException(
          'Failed to create external ID mapping.',
        );
      }
      return newGrubberId;
    }
  }

  private async _preparePhotoRecordsForInsertion(
    placesDetails: GooglePlaceDetailsResult[],
  ): Promise<Array<{ place_id: string; imageUrl: string }>> {
    const allPhotoRecordsToInsert: Array<{
      place_id: string;
      imageUrl: string;
    }> = [];

    await Promise.all(
      placesDetails.map(async (placeDetail) => {
        if (
          placeDetail?.id &&
          placeDetail.photos &&
          placeDetail.photos.length > 0
        ) {
          const photoRefsToFetch = placeDetail.photos.slice(0, 3);

          const fetchedIndividualPhotoData = await Promise.all(
            photoRefsToFetch.map(async (photoRef: GooglePhotoReference) => {
              if (photoRef?.name) {
                return this.googlePlacesApiService.fetchPhotoData(
                  photoRef.name,
                );
              }
              return null;
            }),
          );

          fetchedIndividualPhotoData.forEach((photoData) => {
            if (photoData?.photoUri) {
              allPhotoRecordsToInsert.push({
                place_id: placeDetail.id,
                imageUrl: photoData.photoUri,
              });
            }
          });
        } else {
          if (!placeDetail?.id) {
            this.logger.warn(
              'Place detail found without an ID, cannot process photos.',
              placeDetail,
            );
          }
        }
      }),
    );
    return allPhotoRecordsToInsert;
  }

  private async _fetchProcessAndStoreGooglePlaces(
    searchString: string | undefined,
    coordinates: { latitude: number; longitude: number },
  ): Promise<SupabasePlace[]> {
    this.logger.log(
      `Fetching from Google Places API for search: '${searchString}', coordinates: ${coordinates.latitude},${coordinates.longitude}`,
    );
    const placesDetails = await this.googlePlacesApiService
      .fetchNearbyRestaurantsWithDetails(
        searchString || 'restaurant',
        coordinates,
      )
      .catch((error) => {
        this.logger.error(
          `Error encountered calling GooglePlacesApiService.fetchNearbyRestaurantsWithDetails: ${getErrorMessage(error)}`,
        );
        return [];
      });

    if (placesDetails.length === 0) {
      this.logger.log('No place details returned from Google Places API.');
      return [];
    }

    const allPhotoRecordsToInsert =
      await this._preparePhotoRecordsForInsertion(placesDetails);

    const grubberIdsMap = new Map<string, string>();
    for (const detail of placesDetails) {
      const grubberId = await this._getOrCreateGrubberId('google', detail);
      if (detail.id) {
        grubberIdsMap.set(detail.id, grubberId);
      }
    }

    const supabasePlacesToInsert = convertGooglePlacesToSupabasePlaces(
      placesDetails,
      grubberIdsMap,
    );

    await this.insertSupabasePlaces(supabasePlacesToInsert);

    if (allPhotoRecordsToInsert.length > 0) {
      await this.insertPlacePhotos(allPhotoRecordsToInsert);
    }

    return this.getClosestSupabasePlaces(
      coordinates.latitude,
      coordinates.longitude,
      searchString || '',
    );
  }

  public async fetchAndCacheRestaurantsNearby({
    searchString,
    coordinates,
  }: FetchRestaurantsProps): Promise<SupabasePlace[]> {
    const dbPlaces = await this.getClosestSupabasePlaces(
      coordinates.latitude,
      coordinates.longitude,
      searchString,
    );

    const thresholdMet = Array.isArray(dbPlaces) && dbPlaces.length >= 15;
    const googleApiActive = true;

    if (thresholdMet || !googleApiActive) {
      this.logger.log(`Returning ${dbPlaces.length} places from DB cache.`);
      return dbPlaces;
    } else {
      this.logger.log(
        `DB cache has ${dbPlaces.length} places. Fetching from Google Places API.`,
      );
      return this._fetchProcessAndStoreGooglePlaces(searchString, coordinates);
    }
  }
}
