import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { FindNearbyPlacesDto } from '../../controllers/places/dto/find-nearby-places.dto.js';

export function ApiFindNearbyPlacesResponses() {
  return applyDecorators(
    ApiOperation({ summary: 'Find places near specified coordinates' }),
    ApiBody({
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
        coffeeSeattle: {
          summary: 'Find the best coffee in Seattle',
          description:
            'Example request to find the best coffee shops near downtown Seattle, WA',
          value: {
            latitude: 47.6062,
            longitude: -122.3321,
            keyword: 'coffee',
          },
        },
        parkLondon: {
          summary: 'Find the best fish and chips in London',
          description:
            'Example request to find the best fish and chips shops near Hyde Park, London, UK',
          value: {
            latitude: 51.5074,
            longitude: -0.1278,
            keyword: 'fish and chips',
          },
        },
        museumParis: {
          summary: 'Find the best croissants in Paris',
          description:
            'Example request to find the best croissants shops near the Louvre, Paris, France',
          value: {
            latitude: 48.856613,
            longitude: 2.352222,
            keyword: 'croissant',
          },
        },
        beachSydney: {
          summary: 'Find the best ice cream in Sydney',
          description:
            'Example request to find the best ice cream shops near Bondi Beach, Sydney, Australia',
          value: {
            latitude: -33.891,
            longitude: 151.2769,
            keyword: 'ice cream',
          },
        },
        pizzaNYC: {
          summary: 'Find the best pizza in NYC',
          description:
            'Example request to find the best pizza shops near Times Square, New York, NY',
          value: {
            latitude: 40.758,
            longitude: -73.9855,
            keyword: 'pizza',
          },
        },
      },
    }),
    ApiResponse({
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
    }),
    ApiResponse({
      status: 500,
      description: 'Server error',
      schema: {
        type: 'object',
        properties: {
          error: { type: 'string' },
          details: { type: 'string' },
        },
      },
    }),
  );
}
