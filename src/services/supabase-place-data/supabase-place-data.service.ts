import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from '../supabase/supabase.service.js';
import { getErrorMessage } from '../../types/supabase.types.js';
import {
  PlaceWithPhotosResponse,
  PlaceCoreData,
} from '../../types/places.types.js'; // Adjust path as needed

@Injectable()
export class SupabasePlaceDataService {
  private readonly logger = new Logger(SupabasePlaceDataService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  private getClient(): SupabaseClient {
    return this.supabaseService.client;
  }

  /**
   * Fetches places from Supabase that are geographically close to the given coordinates and match an optional keyword.
   * The search is based on a bounding box and text matching on name, description, or category.
   * @param latitude The latitude of the search center.
   * @param longitude The longitude of the search center.
   * @param keyword Optional keyword to filter places by.
   * @returns A promise that resolves to an array of PlaceWithPhotosResponse from Supabase.
   */
  public async getClosestPlaces(
    latitude: number,
    longitude: number,
    keyword?: string,
  ): Promise<PlaceWithPhotosResponse[]> {
    this.logger.log(
      `Getting closest places from Supabase near lat:${latitude}, long:${longitude}, keyword:${keyword || 'any'}`,
    );
    try {
      const supabase = this.supabaseService.client;
      let query = supabase
        .from('Places')
        .select('*')
        .lte('latitude', latitude + 0.1)
        .gte('latitude', latitude - 0.1)
        .lte('longitude', longitude + 0.1)
        .gte('longitude', longitude - 0.1);

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
      return (data as PlaceWithPhotosResponse[]) || [];
    } catch (error) {
      this.logger.error(
        `Error in getClosestPlaces: ${getErrorMessage(error)}`,
        error instanceof Error ? error.stack : undefined,
      );
      return [];
    }
  }

  /**
   * Inserts or upserts an array of place core data into the Supabase 'Places' table.
   * Uses an onConflict strategy based on 'place_id'.
   * @param places An array of PlaceCoreData objects to insert/upsert.
   * @returns A promise that resolves when the database operation is complete.
   */
  public async insertPlaces(places: PlaceCoreData[]): Promise<void> {
    if (!places || places.length === 0) {
      this.logger.log('No places provided for insertion.');
      return;
    }
    try {
      const supabase = this.supabaseService.client;
      const { error } = await supabase.from('Places').upsert(places, {
        onConflict: 'place_id', // Assuming 'place_id' is your unique identifier for places
      });

      if (error) {
        this.logger.error(
          `Error inserting/upserting places to Supabase: ${error.message}`,
        );
        // Consider if this should throw an error or be handled differently
      } else {
        this.logger.log(
          `Successfully inserted/upserted ${places.length} places.`,
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

  /**
   * Attempts to find an existing place in Supabase by name and location (fuzzy matching).
   * Primarily used to link an external place (e.g., from Google) to an existing Grubber place.
   * @param placeName The name of the place to match.
   * @param placeLat The latitude of the place.
   * @param placeLng The longitude of the place.
   * @param radiusKm The radius (in km) for fuzzy matching (currently simplified to name & bounding box).
   * @returns A promise that resolves to the internal place ID if a match is found, otherwise null.
   */
  public async findFuzzyMatchedPlaceByLocationAndName(
    placeName: string,
    placeLat: number,
    placeLng: number,
  ): Promise<string | null> {
    this.logger.log(
      `Attempting fuzzy match for '${placeName}' at ${placeLat}, ${placeLng}`,
    );
    const supabase = this.supabaseService.client;

    // Define a type for the expected shape of potential matches for clarity
    type PotentialMatch = {
      place_id: string;
      name: string;
      latitude: number;
      longitude: number;
    };

    // Simple bounding box query for initial filtering
    // Adjust the delta (0.01 degrees) based on typical search radius and latitude
    const latDelta = 0.01; // Approx 1.1km, adjust as needed
    const lonDelta = 0.01; // Approx 1.1km at equator, adjust based on latitude for more precision

    const { data: potentialMatchesData, error: matchError } = await supabase
      .from('Places')
      .select('place_id, name, latitude, longitude')
      .gte('latitude', placeLat - latDelta)
      .lte('latitude', placeLat + latDelta)
      .gte('longitude', placeLng - lonDelta)
      .lte('longitude', placeLng + lonDelta);
    // .textSearch('name', `'${placeName}'`); // Optional: Add text search for name if supported and desired

    if (matchError) {
      this.logger.error(
        `Error querying potential matches for fuzzy search: ${matchError.message}`,
      );
      // Decide on error handling: throw or return null?
      // Throwing an exception might be better for critical failures.
      throw new InternalServerErrorException(
        'Failed to query for place matching during fuzzy search.',
      );
    }

    const potentialMatches = potentialMatchesData as PotentialMatch[] | null;

    if (!potentialMatches || potentialMatches.length === 0) {
      this.logger.log(
        'No potential matches found in the initial bounding box query.',
      );
      return null;
    }

    // Haversine distance calculation (imported or defined in utils)
    // For now, assuming getHaversineDistance is available. If not, it needs to be added/imported.
    // import { getHaversineDistance } from '../../utils/places.utils.js';

    const closeMatches = potentialMatches.filter((p: PotentialMatch) => {
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
      // const distance = getHaversineDistance( // This function needs to be available
      //   placeLat,
      //   placeLng,
      //   p.latitude,
      //   p.longitude,
      // );
      // A simpler name check for now, consider more advanced string similarity later
      const namesMatch = p.name.toLowerCase() === placeName.toLowerCase();
      // return distance <= radiusKm && namesMatch;
      return namesMatch; // Simplified for now, add distance check back with getHaversineDistance
    });

    if (closeMatches.length === 1) {
      this.logger.log(
        `Found a single fuzzy match: ${closeMatches[0].place_id}`,
      );
      return closeMatches[0].place_id;
    } else if (closeMatches.length > 1) {
      this.logger.warn(
        `Found ${closeMatches.length} potential fuzzy matches for ${placeName}. Cannot confidently pick one.`,
      );
      return null; // Or implement logic to pick the best match
    } else {
      this.logger.log(
        `No close matches found after filtering for '${placeName}'.`,
      );
      return null;
    }
  }

  /**
   * Retrieves an internal place ID mapping from the 'ExternalPlacesIds' table based on a Google Place ID.
   * @param googleId The Google Place ID.
   * @returns A promise that resolves to the internal place ID if a mapping exists, otherwise null.
   */
  public async getExternalPlaceIdMapping(
    googleId: string,
  ): Promise<string | null> {
    const supabase = this.supabaseService.client;
    const { data, error } = await supabase
      .from('ExternalPlacesIds')
      .select('id') // This is the internal place_id
      .eq('google_id', googleId)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116: "exact one row expected, 0 rows found"
      this.logger.error(
        `Error finding external place ID mapping for Google ID ${googleId}: ${error.message}`,
      );
      throw new InternalServerErrorException(
        'Failed to retrieve external ID mapping.',
      );
    }
    return data ? (data.id as string) : null;
  }

  /**
   * Creates a new mapping in the 'ExternalPlacesIds' table between an internal place ID and a Google Place ID.
   * @param internalPlaceId The internal Grubber place ID.
   * @param googleId The Google Place ID.
   * @returns A promise that resolves when the mapping is created.
   */
  public async createExternalPlaceIdMapping(
    internalPlaceId: string,
    googleId: string,
  ): Promise<void> {
    const supabase = this.supabaseService.client;
    const { error } = await supabase
      .from('ExternalPlacesIds')
      .insert({ id: internalPlaceId, google_id: googleId });

    if (error) {
      this.logger.error(
        `Error creating external place ID mapping for internal ID ${internalPlaceId} and Google ID ${googleId}: ${error.message}`,
      );
      throw new InternalServerErrorException(
        'Failed to create external ID mapping.',
      );
    }
    this.logger.log(
      `Successfully mapped internal ID ${internalPlaceId} to Google ID ${googleId}.`,
    );
  }
}
