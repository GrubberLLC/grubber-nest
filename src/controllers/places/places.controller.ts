import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PlacesService } from '../../services/places/places.service.js';
import { FindNearbyPlacesDto } from './dto/find-nearby-places.dto.js';
import { getErrorMessage } from '../../types/supabase.types.js';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('places')
@Controller()
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post('find-nearby-places')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Find places near specified coordinates' })
  @ApiBody({
    type: FindNearbyPlacesDto,
    examples: {
      restaurantInChino: {
        summary: 'Find restaurants in Chino',
        description: 'Example request to find restaurants near Chino, CA',
        value: {
          latitude: 33.96088917335786,
          longitude: -117.61738173088527,
          keyword: 'restaurant',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Returns nearby places sorted by distance',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          mainImage: { type: 'string', nullable: true },
          latitude: { type: 'number' },
          longitude: { type: 'number' },
          distance: { type: 'number', description: 'Distance in kilometers' },
          category: { type: 'string', nullable: true },
          isOpen: { type: 'boolean', nullable: true },
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Server error',
    schema: {
      type: 'object',
      properties: {
        error: { type: 'string' },
        details: { type: 'string' },
      },
    },
  })
  async findNearbyPlaces(@Body() findNearbyPlacesDto: FindNearbyPlacesDto) {
    try {
      return await this.placesService.findNearbyPlaces(
        findNearbyPlacesDto.latitude,
        findNearbyPlacesDto.longitude,
        findNearbyPlacesDto.keyword,
      );
    } catch (error) {
      throw new HttpException(
        {
          error: 'Failed to fetch nearby places',
          details: getErrorMessage(error),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
