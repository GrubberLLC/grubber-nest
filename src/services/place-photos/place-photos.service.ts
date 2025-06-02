import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service.js';
import { GooglePlacesApiService } from '../google-places/google-places.service.js';
import { getErrorMessage } from '../../types/supabase.types.js';
import {
  GooglePlaceDetailsResult,
  SupabasePlacePhoto,
  PlacePhotoResponse,
  FetchedGooglePhotoData,
  PlaceWithPhotosResponse,
} from '../../types/places.types.js';
import {
  MAX_PHOTOS_PER_PLACE,
  MAX_PHOTOS_TO_SHOW_IMMEDIATELY,
} from '../../constants/places.constants.js';

@Injectable()
export class PlacePhotoService {
  private readonly logger = new Logger(PlacePhotoService.name);

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly googlePlacesApiService: GooglePlacesApiService,
  ) {}

  /**
   * Queues photos from Google Place details for background processing and storage.
   * It checks how many photos are already stored for a place and only processes new ones
   * up to MAX_PHOTOS_PER_PLACE.
   * Actual photo fetching from Google and job queuing (conceptual) happens here.
   * @param placeDetail The full details of a place from Google Places API.
   * @param internalPlaceId The internal Grubber ID for the place.
   * @returns A promise that resolves when photo queuing is complete for the place.
   */
  public async queuePhotoProcessingForPlace(
    placeDetail: GooglePlaceDetailsResult,
    internalPlaceId: string,
  ): Promise<void> {
    const supabase = this.supabaseService.client;

    const { count: existingPhotoCount, error: countError } = await supabase
      .from('PlacePhotos')
      .select('*', { count: 'exact', head: true })
      .eq('place_id', internalPlaceId);

    if (countError) {
      this.logger.error(
        `Error counting photos for place ${internalPlaceId}: ${countError.message}. Skipping photo processing for this place.`,
      );
      return;
    }

    const currentPhotoCount = existingPhotoCount ?? 0;
    if (currentPhotoCount >= MAX_PHOTOS_PER_PLACE) {
      this.logger.verbose(
        `Place ${internalPlaceId} already has ${currentPhotoCount} photos (max ${MAX_PHOTOS_PER_PLACE}). Skipping new photo processing.`,
      );
      return;
    }

    const photosNeeded = MAX_PHOTOS_PER_PLACE - currentPhotoCount;
    if (photosNeeded <= 0) {
      return;
    }

    const googlePhotoReferences = (placeDetail.photos || []).slice(
      0,
      photosNeeded,
    );

    if (googlePhotoReferences.length === 0) {
      this.logger.log(
        `No new Google photo references for place ${internalPlaceId} to consider for processing (needed: ${photosNeeded}).`,
      );
      return;
    }

    this.logger.verbose(
      `Place ${internalPlaceId}: ${currentPhotoCount} existing, ${photosNeeded} needed, ${googlePhotoReferences.length} from Google being processed. Total available from Google: ${(placeDetail.photos || []).length}.`,
    );
    const photosToInsert: SupabasePlacePhoto[] = [];

    for (const photoRef of googlePhotoReferences) {
      if (!photoRef?.name) {
        this.logger.warn(
          `Skipping photo with no name for place ${internalPlaceId}`,
        );
        continue;
      }

      try {
        // fetch the photo data from google
        const googlePhotoData =
          await this.googlePlacesApiService.fetchPhotoData(photoRef.name);

        // if there is no photo uri, skip
        if (!googlePhotoData?.photoUri) {
          this.logger.warn(
            `No photo URI from Google for ref: ${photoRef.name}, place ${internalPlaceId}. Cannot queue.`,
          );
          continue;
        }

        this.logger.verbose(
          `Fetched Google URI '${googlePhotoData.photoUri}' for ref '${photoRef.name}', place ${internalPlaceId} for queuing.`,
        );

        // We need to insert the photo entries into the PlacePhotos table

        const photoToInsert: SupabasePlacePhoto = {
          place_photo_id: undefined,
          place_id: internalPlaceId,
          photo_reference_name: photoRef.name,
          storage_path: null,
          original_uri: googlePhotoData.photoUri,
        };

        photosToInsert.push(photoToInsert);

        this.logger.verbose(
          `Successfully queued image processing job for place ${internalPlaceId}.`,
        );
      } catch (error) {
        this.logger.error(
          `Error fetching Google photo data or queueing job for ref ${photoRef.name}, place ${internalPlaceId}: ${getErrorMessage(error)}`,
          error instanceof Error ? error.stack : undefined,
        );
      }
    }

    if (photosToInsert.length > 0) {
      this.logger.verbose(
        `Inserting ${photosToInsert.length} photos for place ${internalPlaceId}`,
      );
      await this.insertSupabasePlacePhotos(photosToInsert);
    }
  }

  /**
   * Fetches temporary, directly usable photo URIs from Google for a given set of photo references.
   * This is used to quickly display photos before they are processed and stored permanently.
   * @param googlePhotos An array of photo reference objects from GooglePlaceDetailsResult.
   * @param existingPhotoRefs A set of photo reference names that already exist for the place (to avoid re-fetching).
   * @param maxNeeded The maximum number of new temporary photos to fetch.
   * @param placeIdForLogging The internal place ID, used for logging purposes.
   * @returns A promise that resolves to an array of PlacePhotoResponse objects with temporary URIs.
   */
  public async fetchTemporaryGooglePhotoUris(
    googlePhotos: GooglePlaceDetailsResult['photos'],
    existingPhotoRefs: Set<string>,
    maxNeeded: number,
    placeIdForLogging: string,
  ): Promise<PlacePhotoResponse[]> {
    const newTempPhotos: PlacePhotoResponse[] = [];
    if (!googlePhotos || googlePhotos.length === 0 || maxNeeded <= 0) {
      return newTempPhotos;
    }

    let fetchedCount = 0;
    for (const photoRef of googlePhotos) {
      if (fetchedCount >= maxNeeded) break;

      if (photoRef?.name && !existingPhotoRefs.has(photoRef.name)) {
        try {
          const googlePhotoData: FetchedGooglePhotoData | null =
            await this.googlePlacesApiService.fetchPhotoData(photoRef.name);
          if (googlePhotoData?.photoUri) {
            newTempPhotos.push({
              original_uri: googlePhotoData.photoUri,
              photo_reference_name: photoRef.name,
              storage_path: null, // Indicates it's a temporary URI
            });
            fetchedCount++;
          }
        } catch (photoError) {
          this.logger.warn(
            `Failed to fetch temporary photo data for photoRef ${photoRef.name} for place ${placeIdForLogging}: ${getErrorMessage(photoError)}`,
          );
        }
      }
    }
    return newTempPhotos;
  }

  /**
   * Inserts or upserts photo records into the Supabase 'PlacePhotos' table.
   * Uses an onConflict strategy for place_id and photo_reference_name.
   * @param placePhotos An array of SupabasePlacePhoto objects to insert/upsert.
   * @returns A promise that resolves when the database operation is complete.
   */
  public async insertSupabasePlacePhotos(
    placePhotos: SupabasePlacePhoto[],
  ): Promise<void> {
    if (!placePhotos || placePhotos.length === 0) {
      this.logger.log(
        'insertSupabasePlacePhotos: No photos provided to insert.',
      );
      return;
    }

    this.logger.log(
      `insertSupabasePlacePhotos: Attempting to insert/upsert ${placePhotos.length} photo records.`,
    );

    const photosToInsert = placePhotos.map(({ place_photo_id, ...rest }) => {
      void place_photo_id;
      return rest;
    });

    try {
      const supabase = this.supabaseService.client;
      const { error } = await supabase
        .from('PlacePhotos')
        .upsert(photosToInsert, {
          onConflict: 'place_id,photo_reference_name',
          ignoreDuplicates: true,
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

  /**
   * Fetches existing photos for a list of places from the database and augments them by backfilling
   * additional photos from Google up to MAX_PHOTOS_PER_PLACE.
   * It can use pre-fetched Google details to avoid redundant API calls.
   * Finally, it slices the photo arrays to MAX_PHOTOS_TO_SHOW_IMMEDIATELY for API response.
   * @param places An array of PlaceWithPhotosResponse objects (places from DB).
   * @param allPreviouslyFetchedGoogleDetails Optional array of full GooglePlaceDetailsResult for all relevant places.
   * @returns A promise that resolves to an array of PlaceWithPhotosResponse, with photos augmented and sliced.
   */
  public async getAugmentedPhotosForPlaces(
    places: PlaceWithPhotosResponse[],
    allPreviouslyFetchedGoogleDetails?: GooglePlaceDetailsResult[],
  ): Promise<PlaceWithPhotosResponse[]> {
    // if there are no places, return an empty array
    if (!places || places.length === 0) {
      return [];
    }
    const supabase = this.supabaseService.client;

    // get the place ids
    const placeIds = places
      .map((place) => place.place_id)
      .filter((id): id is string => id !== undefined);

    // if there are no place ids, return the places with no photos
    if (placeIds.length === 0) {
      return places.map((p) => ({ ...p, photos: [] }));
    }

    // fetch existing photos from supabase using place ids
    const { data: existingPhotoRecords, error: photoError } = await supabase
      .from('PlacePhotos')
      .select(
        'place_id, storage_path, original_uri, photo_reference_name, supabase_uri',
      )
      .in('place_id', placeIds);

    // if there is an error, log it
    if (photoError) {
      this.logger.error(
        `Error fetching existing photos for places: ${photoError.message}`,
      );
    }

    // create a map of photos by place id
    const photosByPlaceId = new Map<string, PlacePhotoResponse[]>();

    // if there are photos, add them to the map
    if (existingPhotoRecords) {
      // convert the existing photo records to an array of SupabasePlacePhoto and place_id
      for (const record of existingPhotoRecords as Array<
        SupabasePlacePhoto & { place_id: string }
      >) {
        // create a photo response object
        const photoResponse: PlacePhotoResponse = {
          storage_path: record.storage_path,
          original_uri: record.original_uri ?? '',
          photo_reference_name: record.photo_reference_name,
          supabase_uri: record.supabase_uri ?? '',
        };

        // if the place id is not in the map, add it
        if (!photosByPlaceId.has(record.place_id)) {
          photosByPlaceId.set(record.place_id, []);
        }

        // add the photo to the place id
        photosByPlaceId.get(record.place_id)!.push(photoResponse);
      }
    }

    // create a map of place ids to google ids
    const placeIdToGoogleIdMap = new Map<string, string>();

    // fetch external ids from supabase using place ids
    const { data: externalIdRecords, error: externalIdError } = await supabase
      .from('ExternalPlacesIds')
      .select('id, google_id')
      .in('id', placeIds);

    // if there is an error, log it
    if (externalIdError) {
      this.logger.error(
        `Error fetching external IDs for photo backfill: ${externalIdError.message}`,
      );
    } else if (externalIdRecords) {
      // if there are external ids, add them to the map
      // convert the external id records to an array of id and google_id
      externalIdRecords.forEach((record) => {
        if (
          record.id &&
          typeof record.id === 'string' &&
          record.google_id &&
          typeof record.google_id === 'string'
        ) {
          placeIdToGoogleIdMap.set(record.id, record.google_id);
        }
      });
    }

    // add photos to the places from the map
    const augmentedPlaces = await Promise.all(
      places.map(async (place) => {
        // get the photos for the place
        let currentPhotos = place.place_id
          ? photosByPlaceId.get(place.place_id) || []
          : [];
        currentPhotos = [...currentPhotos];

        // if the place id is in the map and there are less than the max photos per place, fetch photos from google
        if (place.place_id && currentPhotos.length < MAX_PHOTOS_PER_PLACE) {
          // get the google id
          const googleId = placeIdToGoogleIdMap.get(place.place_id);

          // if the google id is in the map, fetch the details
          if (googleId) {
            let placeDetailsFromGoogle:
              | GooglePlaceDetailsResult
              | null
              | undefined = allPreviouslyFetchedGoogleDetails?.find(
              (detail) => detail.id === googleId,
            );

            // if the place details are not in the map, fetch them
            if (!placeDetailsFromGoogle) {
              this.logger.log(
                `Place ${place.place_id} (Google ID: ${googleId}): Needs photo backfill. Details not pre-fetched, fetching now. Has ${currentPhotos.length}, max ${MAX_PHOTOS_PER_PLACE}`,
              );
              try {
                placeDetailsFromGoogle =
                  await this.googlePlacesApiService.fetchDetails(googleId);
              } catch (detailFetchError) {
                this.logger.error(
                  `Failed to fetch Google details for ${googleId} (place ${place.place_id}) for photo backfill: ${getErrorMessage(detailFetchError)}`,
                );
                placeDetailsFromGoogle = null;
              }
            } else {
              this.logger.verbose(
                `Place ${place.place_id} (Google ID: ${googleId}): Using pre-fetched details for photo backfill.`,
              );
            }

            if (
              placeDetailsFromGoogle &&
              placeDetailsFromGoogle.photos &&
              placeDetailsFromGoogle.photos.length > 0
            ) {
              const existingPhotoRefsInCurrentList = new Set(
                currentPhotos.map((p) => p.photo_reference_name),
              );
              const photosStillNeeded =
                MAX_PHOTOS_PER_PLACE - currentPhotos.length;

              if (photosStillNeeded > 0 && place.place_id) {
                const tempPhotosFromGoogle =
                  await this.fetchTemporaryGooglePhotoUris(
                    placeDetailsFromGoogle.photos,
                    existingPhotoRefsInCurrentList,
                    photosStillNeeded,
                    place.place_id,
                  );

                for (const tempPhoto of tempPhotosFromGoogle) {
                  currentPhotos.push(tempPhoto);
                  this.logger.verbose(
                    `Place ${place.place_id}: Added temp photo ref ${tempPhoto.photo_reference_name} for backfill.`,
                  );
                }
              }
            }
          }
        }
        return {
          ...place,
          photos: currentPhotos.slice(0, MAX_PHOTOS_TO_SHOW_IMMEDIATELY),
        };
      }),
    );
    return augmentedPlaces;
  }
}
