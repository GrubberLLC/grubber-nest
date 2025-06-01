import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

export const ApiCreatePreference = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Create user preferences' }),
    ApiBody({
      schema: {
        type: 'object',
        required: ['userId'],
        properties: {
          userId: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
            description: 'User ID',
          },
          dietaryRestrictions: {
            type: 'array',
            items: {
              type: 'string',
              enum: [
                'vegetarian',
                'vegan',
                'gluten-free',
                'dairy-free',
                'halal',
                'kosher',
              ],
            },
            example: ['vegetarian', 'gluten-free'],
            description: 'User dietary restrictions',
          },
          favoriteCuisines: {
            type: 'array',
            items: {
              type: 'string',
            },
            example: ['italian', 'japanese', 'mexican'],
            description: 'User favorite cuisines',
          },
          priceRange: {
            type: 'string',
            enum: ['budget', 'moderate', 'expensive', 'luxury'],
            example: 'moderate',
            description: 'User preferred price range',
          },
          preferredRadius: {
            type: 'number',
            example: 5,
            description: 'Preferred search radius in kilometers',
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Preferences created successfully',
      schema: {
        type: 'object',
        properties: {
          preference_id: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          user_id: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          dietary_restrictions: {
            type: 'array',
            items: { type: 'string' },
            example: ['vegetarian', 'gluten-free'],
          },
          favorite_cuisines: {
            type: 'array',
            items: { type: 'string' },
            example: ['italian', 'japanese', 'mexican'],
          },
          price_range: {
            type: 'string',
            example: 'moderate',
          },
          preferred_radius: {
            type: 'number',
            example: 5,
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
          error: {
            type: 'string',
            example: 'Failed to create preferences',
          },
          details: {
            type: 'string',
            example: 'Error message details',
          },
        },
      },
    }),
  );
};

export const ApiGetPreference = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Get user preferences' }),
    ApiBody({
      schema: {
        type: 'object',
        required: ['userId'],
        properties: {
          userId: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
            description: 'User ID',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Preferences retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          preference_id: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          user_id: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          dietary_restrictions: {
            type: 'array',
            items: { type: 'string' },
            example: ['vegetarian', 'gluten-free'],
          },
          favorite_cuisines: {
            type: 'array',
            items: { type: 'string' },
            example: ['italian', 'japanese', 'mexican'],
          },
          price_range: {
            type: 'string',
            example: 'moderate',
          },
          preferred_radius: {
            type: 'number',
            example: 5,
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Preferences not found',
      schema: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            example: 'Preferences not found',
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
          error: {
            type: 'string',
            example: 'Failed to get preferences',
          },
          details: {
            type: 'string',
            example: 'Error message details',
          },
        },
      },
    }),
  );
};

export const ApiUpdatePreference = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Update user preferences' }),
    ApiBody({
      schema: {
        type: 'object',
        required: ['preferenceId'],
        properties: {
          preferenceId: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
            description: 'Preference ID',
          },
          userId: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
            description: 'User ID',
          },
          dietaryRestrictions: {
            type: 'array',
            items: {
              type: 'string',
              enum: [
                'vegetarian',
                'vegan',
                'gluten-free',
                'dairy-free',
                'halal',
                'kosher',
              ],
            },
            example: ['vegetarian', 'gluten-free'],
            description: 'User dietary restrictions',
          },
          favoriteCuisines: {
            type: 'array',
            items: {
              type: 'string',
            },
            example: ['italian', 'japanese', 'mexican'],
            description: 'User favorite cuisines',
          },
          priceRange: {
            type: 'string',
            enum: ['budget', 'moderate', 'expensive', 'luxury'],
            example: 'moderate',
            description: 'User preferred price range',
          },
          preferredRadius: {
            type: 'number',
            example: 5,
            description: 'Preferred search radius in kilometers',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Preferences updated successfully',
      schema: {
        type: 'object',
        properties: {
          preference_id: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          user_id: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          dietary_restrictions: {
            type: 'array',
            items: { type: 'string' },
            example: ['vegetarian', 'gluten-free'],
          },
          favorite_cuisines: {
            type: 'array',
            items: { type: 'string' },
            example: ['italian', 'japanese', 'mexican'],
          },
          price_range: {
            type: 'string',
            example: 'moderate',
          },
          preferred_radius: {
            type: 'number',
            example: 5,
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Preferences not found',
      schema: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            example: 'Preferences not found',
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
          error: {
            type: 'string',
            example: 'Failed to update preferences',
          },
          details: {
            type: 'string',
            example: 'Error message details',
          },
        },
      },
    }),
  );
};

export const ApiDeletePreference = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Delete user preferences' }),
    ApiBody({
      schema: {
        type: 'object',
        required: ['preferenceId'],
        properties: {
          preferenceId: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
            description: 'Preference ID',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Preferences deleted successfully',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Preferences deleted successfully',
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Preferences not found',
      schema: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            example: 'Preferences not found',
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
          error: {
            type: 'string',
            example: 'Failed to delete preferences',
          },
          details: {
            type: 'string',
            example: 'Error message details',
          },
        },
      },
    }),
  );
};
