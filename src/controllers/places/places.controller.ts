import { Controller, Post, Body, HttpException } from '@nestjs/common';
import { PlacesService } from '../../services/places/places.service.js';
import { FindNearbyPlacesDto } from './dto/find-nearby-places.dto.js';
import { ApiTags } from '@nestjs/swagger';
import { ApiFindNearbyPlacesResponses } from '../../decorators/swagger/find-places-nearby.decorator.js';
import { getErrorMessage } from '../../types/supabase.types.js';

@ApiTags('places')
@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  /**
   * Endpoint to find nearby places (restaurants) based on coordinates and an optional keyword.
   * It fetches data from the PlacesService, which may involve database lookups and external API calls.
   * @param findNearbyPlacesDto DTO containing latitude, longitude, and optional keyword.
   * @returns A promise that resolves to an array of places with their photo information.
   * @throws HttpException if an unexpected error occurs.
   */
  @Post('nearby')
  @ApiFindNearbyPlacesResponses()
  async findNearbyPlaces(@Body() findNearbyPlacesDto: FindNearbyPlacesDto) {
    try {
      return await this.placesService.fetchAndCacheRestaurantsNearby({
        coordinates: {
          latitude: findNearbyPlacesDto.latitude,
          longitude: findNearbyPlacesDto.longitude,
        },
        searchString: findNearbyPlacesDto.keyword || '',
      });
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          error: 'Internal Server Error',
          message: getErrorMessage(error),
        },
        500,
      );
    }
  }
}
