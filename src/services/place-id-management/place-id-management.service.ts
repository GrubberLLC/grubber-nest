import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { SupabasePlaceDataService } from '../supabase-place-data/supabase-place-data.service.js'; // Adjust path
import { GooglePlaceDetailsResult } from '../../types/places.types.js'; // Adjust path

@Injectable()
export class PlaceIdManagementService {
  private readonly logger = new Logger(PlaceIdManagementService.name);

  constructor(
    private readonly supabasePlaceDataService: SupabasePlaceDataService,
  ) {}

  /**
   * Gets an existing internal place ID for a given Google Place, or creates a new one if no match is found.
   * This process involves:
   * 1. Checking for a direct mapping via Google Place ID in 'ExternalPlacesIds'.
   * 2. If no direct mapping, attempting a fuzzy match based on place name and location against existing 'Places'.
   * 3. If still no match, generating a new UUID as the internal place ID.
   * In all cases where an ID is found or created, it ensures the Google Place ID is mapped to the internal ID in 'ExternalPlacesIds'.
   * @param googlePlaceDetails The full details of the place from Google Places API.
   * @returns A promise that resolves to the internal (Grubber) place ID (string).
   * @throws InternalServerErrorException if essential details are missing or database operations fail.
   */
  public async getOrCreateInternalPlaceId(
    googlePlaceDetails: GooglePlaceDetailsResult,
  ): Promise<string> {
    const googleId = googlePlaceDetails.id;
    const placeNameInput =
      googlePlaceDetails.displayName?.text || googlePlaceDetails.name;
    const placeLat = googlePlaceDetails.location?.latitude;
    const placeLng = googlePlaceDetails.location?.longitude;

    this.logger.verbose(
      `getOrCreateInternalPlaceId: Processing Google ID '${googleId}' for place '${placeNameInput}'`,
    );

    if (!googleId) {
      this.logger.error(
        'Missing Google ID from place details.',
        googlePlaceDetails,
      );
      throw new InternalServerErrorException(
        'Google Place ID is missing, cannot process.',
      );
    }
    if (!placeNameInput || placeLat === undefined || placeLng === undefined) {
      this.logger.error(
        `Missing essential details (Name, Lat, Lng) for matching. Google ID: ${googleId}`,
        googlePlaceDetails,
      );
      throw new InternalServerErrorException(
        'Insufficient place details for ID creation/matching.',
      );
    }
    const placeName: string = placeNameInput;

    // 1. Check for an existing mapping in ExternalPlacesIds
    const existingInternalId =
      await this.supabasePlaceDataService.getExternalPlaceIdMapping(googleId);
    if (existingInternalId) {
      this.logger.verbose(
        `Found existing internal place ID '${existingInternalId}' for Google ID '${googleId}' via ExternalPlacesIds table.`,
      );
      return existingInternalId;
    }

    this.logger.verbose(
      `No direct mapping in ExternalPlacesIds for Google ID '${googleId}'. Attempting fuzzy match for place '${placeName}'.`,
    );
    // 2. Attempt fuzzy matching if no direct mapping exists
    const fuzzyMatchedInternalId =
      await this.supabasePlaceDataService.findFuzzyMatchedPlaceByLocationAndName(
        placeName,
        placeLat,
        placeLng,
      );

    if (fuzzyMatchedInternalId) {
      this.logger.log(
        `Fuzzy match found. Linking Google ID '${googleId}' to existing internal place ID '${fuzzyMatchedInternalId}'.`,
      );
      // Link the Google ID to the found internal ID in ExternalPlacesIds
      await this.supabasePlaceDataService.createExternalPlaceIdMapping(
        fuzzyMatchedInternalId,
        googleId,
      );
      return fuzzyMatchedInternalId;
    }

    // 3. If no existing mapping and no fuzzy match, create a new internal ID
    const newInternalPlaceId = uuidv4();
    this.logger.log(
      `No fuzzy match. Creating new internal place ID '${newInternalPlaceId}' and linking to Google ID '${googleId}'.`,
    );
    await this.supabasePlaceDataService.createExternalPlaceIdMapping(
      newInternalPlaceId,
      googleId,
    );
    return newInternalPlaceId;
  }
}
