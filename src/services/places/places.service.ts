import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service.js';
import {
  SupabaseResponse,
  getErrorMessage,
} from '../../types/supabase.types.js';

interface Place {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  // Define specific properties instead of any
  mainImage?: string;
  mainImage2?: string;
  mainImage3?: string;
  isOpen?: boolean;
  addressStreet?: string;
  addressCity?: string;
  addressState?: string;
  addressZip?: string;
  addressDisplay1?: string;
  phoneNumber?: string;
  price?: string;
  businessUrl?: string;
  foodQualityRating?: number;
  serviceRating?: number;
  cleanlinessRating?: number;
  category?: string;
  description?: string;
  googleId?: string;
  distance?: number;
}

@Injectable()
export class PlacesService {
  private readonly logger = new Logger(PlacesService.name);
  private readonly SEARCH_RADIUS_METERS = 16093.4; // 10 miles in meters

  constructor(private readonly supabaseService: SupabaseService) {}

  async findNearbyPlaces(
    latitude: number,
    longitude: number,
    keyword?: string,
  ) {
    this.logger.log(
      `Finding places near lat:${latitude}, long:${longitude}, keyword:${keyword}`,
    );

    try {
      // Get Supabase client
      const supabase = this.supabaseService.getClient();

      // Create a query with bounding box for initial filtering
      let query = supabase
        .from('Places')
        .select(
          `
          id, name, mainImage, mainImage2, mainImage3, isOpen, 
          addressStreet, addressCity, addressState, addressZip, addressDisplay1, 
          latitude, longitude, phoneNumber, price, businessUrl, 
          foodQualityRating, serviceRating, cleanlinessRating, category, description, googleId
        `,
        )
        .lte('latitude', latitude + 0.15) // Approximate bounding box for optimization
        .gte('latitude', latitude - 0.15)
        .lte('longitude', longitude + 0.15)
        .gte('longitude', longitude - 0.15);

      // Apply keyword filtering if provided
      if (keyword) {
        query = query.or(
          `name.ilike.%${keyword}%,category.ilike.%${keyword}%,description.ilike.%${keyword}%`,
        );
      }

      // Execute the query
      const response = await query;
      const { data, error } = response as unknown as SupabaseResponse<Place[]>;

      if (error) {
        this.logger.error(`Error fetching places: ${error.message}`);
        throw new Error(`Failed to fetch places: ${error.message}`);
      }

      if (!data) {
        return [];
      }

      // Calculate distance for each place and filter by actual distance
      const filteredAndSortedPlaces = data
        .map((place) => ({
          ...place,
          distance: this.getHaversineDistance(
            latitude,
            longitude,
            place.latitude,
            place.longitude,
          ),
        }))
        .filter((place) => place.distance <= this.SEARCH_RADIUS_METERS / 1000) // Convert to km
        .sort((a, b) => (a.distance || 0) - (b.distance || 0)); // Sort by closest

      return filteredAndSortedPlaces.slice(0, 10); // Return top 10 closest places
    } catch (error) {
      this.logger.error(`Error in findNearbyPlaces: ${getErrorMessage(error)}`);
      throw error;
    }
  }

  // Haversine formula to calculate distance between two points
  private getHaversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }
}
