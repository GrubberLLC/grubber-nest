import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import axios, { isAxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';
import {
  GOOGLE_PLACES_NEARBY_SEARCH_API_URL,
  GOOGLE_PLACES_DETAILS_API_URL,
  GOOGLE_PLACES_PHOTOS_API_URL,
} from '../../constants/places.constants.js';
import {
  Coordinates,
  GooglePlaceSearchResult,
  GooglePlaceDetailsResult,
  FetchedGooglePhotoData,
} from '../../types/places.types.js';

@Injectable()
export class GooglePlacesApiService {
  private readonly logger = new Logger(GooglePlacesApiService.name);
  private readonly GOOGLE_API_KEY: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GOOGLE_API_KEY_INFO');
    if (!apiKey) {
      this.logger.error(
        'GOOGLE_API_KEY_INFO not found in environment variables. Google Places API calls will fail.',
      );
      // Throw error during construction if key is missing
      throw new Error(
        'Missing GOOGLE_API_KEY_INFO in configuration for GooglePlacesApiService.',
      );
    }
    this.GOOGLE_API_KEY = apiKey;
  }

  // --- Public methods for interacting with Google Places API ---

  public async fetchNearbyResults(
    searchString: string,
    coordinates: Coordinates,
  ): Promise<GooglePlaceSearchResult[]> {
    if (!this.GOOGLE_API_KEY) {
      // Should be caught by constructor, but defensively check
      this.logger.error('GOOGLE_API_KEY not available in fetchNearbyResults.');
      throw new InternalServerErrorException('Google API Key not configured.');
    }
    try {
      const response = await axios.post<{ results: GooglePlaceSearchResult[] }>(
        GOOGLE_PLACES_NEARBY_SEARCH_API_URL,
        null,
        {
          params: {
            key: this.GOOGLE_API_KEY,
            location: `${coordinates.latitude},${coordinates.longitude}`,
            radius: 5000,
            keyword: searchString,
            type: 'restaurant',
            rankby: 'prominence',
            limit: 25,
          },
        },
      );
      return response?.data?.results || [];
    } catch (error) {
      let errorMessage =
        'An unknown error occurred fetching nearby places from Google.';
      let errorDetails: unknown;

      if (isAxiosError(error)) {
        errorMessage = `Google Nearby API request failed: ${error.message}`;
        errorDetails = error.response?.data;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      this.logger.error(
        `Error in fetchNearbyResults: ${errorMessage}`,
        errorDetails,
      );
      throw new InternalServerErrorException(
        'Failed to fetch nearby places from Google.',
      );
    }
  }

  public async fetchDetails(
    placeId: string,
  ): Promise<GooglePlaceDetailsResult | null> {
    if (!this.GOOGLE_API_KEY) {
      this.logger.error('GOOGLE_API_KEY not available in fetchDetails.');
      throw new InternalServerErrorException('Google API Key not configured.');
    }
    try {
      const response = await axios.get<GooglePlaceDetailsResult>(
        `${GOOGLE_PLACES_DETAILS_API_URL}/${placeId}`,
        {
          headers: { 'Content-Type': 'application/json' },
          params: {
            key: this.GOOGLE_API_KEY,
            // Ensure fields match the GooglePlaceDetailsResult type
            // Added regularOpeningHours to get open_now status
            fields:
              'id,name,photos,formattedAddress,nationalPhoneNumber,location,displayName,regularOpeningHours,priceLevel,rating,userRatingCount,websiteUri,types,editorialSummary',
          },
        },
      );
      return response?.data;
    } catch (error) {
      let errorMessage =
        'An unknown error occurred fetching place details from Google.';
      let errorDetails: unknown;

      if (isAxiosError(error)) {
        errorMessage = `Google Details API request failed for placeId ${placeId}: ${error.message}`;
        errorDetails = error.response?.data;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      this.logger.error(
        `Error in fetchDetails for placeId ${placeId}: ${errorMessage}`,
        errorDetails,
      );
      // Return null for details fetch failure, let caller handle
      return null;
    }
  }

  public async fetchPhotoData(
    photoName: string,
  ): Promise<FetchedGooglePhotoData | null> {
    if (!this.GOOGLE_API_KEY) {
      this.logger.error('GOOGLE_API_KEY not available in fetchPhotoData.');
      throw new InternalServerErrorException('Google API Key not configured.');
    }
    try {
      const response = await axios.get<FetchedGooglePhotoData>(
        `${GOOGLE_PLACES_PHOTOS_API_URL}/${photoName}/media`,
        {
          params: {
            key: this.GOOGLE_API_KEY,
            maxHeightPx: 1600,
            skipHttpRedirect: true,
          },
          headers: { 'Content-Type': 'application/json' },
        },
      );
      return response?.data;
    } catch (error) {
      let errorMessage =
        'An unknown error occurred fetching photo data from Google.';
      let errorDetails: unknown;

      if (isAxiosError(error)) {
        errorMessage = `Google Photos API request failed for photo ${photoName}: ${error.message}`;
        errorDetails = error.response?.data;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      this.logger.error(
        `Error in fetchPhotoData for name ${photoName}: ${errorMessage}`,
        errorDetails,
      );
      // Return null for photo fetch failure
      return null;
    }
  }

  /**
   * Fetches nearby places from Google and then fetches details for each.
   * Does not include photo fetching logic, which is often handled separately.
   */
  public async fetchNearbyRestaurantsWithDetails(
    searchString: string,
    coordinates: Coordinates,
  ): Promise<GooglePlaceDetailsResult[]> {
    // Call the nearby search method of this service
    const places = await this.fetchNearbyResults(searchString, coordinates);
    if (!places || places.length === 0) {
      this.logger.log('No nearby places found from Google API.');
      return [];
    }

    this.logger.log(
      `Found ${places.length} nearby places from Google, fetching details...`,
    );

    // Call the details fetching method of this service
    const placesDetailsPromises = places.map(async (place) => {
      if (place.place_id) {
        return this.fetchDetails(place.place_id);
      }
      this.logger.warn('Found a place result without a place_id', place);
      return null;
    });

    const resolvedDetails = await Promise.all(placesDetailsPromises);

    // Filter out any null results (where details fetching failed)
    const validDetails = resolvedDetails.filter(
      (detail): detail is GooglePlaceDetailsResult => detail !== null,
    );

    this.logger.log(
      `Successfully fetched details for ${validDetails.length} places.`,
    );
    return validDetails;
  }
}
