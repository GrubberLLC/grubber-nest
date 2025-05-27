import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

export const ApiCreateProfile = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Create user profile' }),
    ApiBody({
      schema: {
        type: 'object',
        required: ['userId', 'username', 'email'],
        properties: {
          userId: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
            description: 'User ID',
          },
          username: {
            type: 'string',
            example: 'johndoe',
            description: 'Username',
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'john@example.com',
            description: 'Email address',
          },
          firstName: {
            type: 'string',
            example: 'John',
            description: 'First name',
          },
          lastName: {
            type: 'string',
            example: 'Doe',
            description: 'Last name',
          },
          bio: {
            type: 'string',
            example: 'Food enthusiast and travel lover',
            description: 'User biography',
          },
          profilePicture: {
            type: 'string',
            example: 'https://example.com/profile.jpg',
            description: 'Profile picture URL',
          },
          location: {
            type: 'string',
            example: 'New York, USA',
            description: 'User location',
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Profile created successfully',
      schema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          user_id: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          username: {
            type: 'string',
            example: 'johndoe',
          },
          email: {
            type: 'string',
            example: 'john@example.com',
          },
          first_name: {
            type: 'string',
            example: 'John',
          },
          last_name: {
            type: 'string',
            example: 'Doe',
          },
          bio: {
            type: 'string',
            example: 'Food enthusiast and travel lover',
          },
          profile_picture: {
            type: 'string',
            example: 'https://example.com/profile.jpg',
          },
          location: {
            type: 'string',
            example: 'New York, USA',
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            example: '2024-03-20T12:00:00Z',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            example: '2024-03-20T12:00:00Z',
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
            example: 'Failed to create profile',
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

export const ApiGetProfile = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Get user profile' }),
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
      description: 'Profile retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          user_id: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          username: {
            type: 'string',
            example: 'johndoe',
          },
          email: {
            type: 'string',
            example: 'john@example.com',
          },
          first_name: {
            type: 'string',
            example: 'John',
          },
          last_name: {
            type: 'string',
            example: 'Doe',
          },
          bio: {
            type: 'string',
            example: 'Food enthusiast and travel lover',
          },
          profile_picture: {
            type: 'string',
            example: 'https://example.com/profile.jpg',
          },
          location: {
            type: 'string',
            example: 'New York, USA',
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            example: '2024-03-20T12:00:00Z',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            example: '2024-03-20T12:00:00Z',
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Profile not found',
      schema: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            example: 'Profile not found',
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
            example: 'Failed to get profile',
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

export const ApiUpdateProfile = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Update user profile' }),
    ApiBody({
      schema: {
        type: 'object',
        required: ['profileId'],
        properties: {
          profileId: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
            description: 'Profile ID',
          },
          userId: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
            description: 'User ID',
          },
          username: {
            type: 'string',
            example: 'johndoe',
            description: 'Username',
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'john@example.com',
            description: 'Email address',
          },
          firstName: {
            type: 'string',
            example: 'John',
            description: 'First name',
          },
          lastName: {
            type: 'string',
            example: 'Doe',
            description: 'Last name',
          },
          bio: {
            type: 'string',
            example: 'Food enthusiast and travel lover',
            description: 'User biography',
          },
          profilePicture: {
            type: 'string',
            example: 'https://example.com/profile.jpg',
            description: 'Profile picture URL',
          },
          location: {
            type: 'string',
            example: 'New York, USA',
            description: 'User location',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Profile updated successfully',
      schema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          user_id: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          username: {
            type: 'string',
            example: 'johndoe',
          },
          email: {
            type: 'string',
            example: 'john@example.com',
          },
          first_name: {
            type: 'string',
            example: 'John',
          },
          last_name: {
            type: 'string',
            example: 'Doe',
          },
          bio: {
            type: 'string',
            example: 'Food enthusiast and travel lover',
          },
          profile_picture: {
            type: 'string',
            example: 'https://example.com/profile.jpg',
          },
          location: {
            type: 'string',
            example: 'New York, USA',
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            example: '2024-03-20T12:00:00Z',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            example: '2024-03-20T12:00:00Z',
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Profile not found',
      schema: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            example: 'Profile not found',
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
            example: 'Failed to update profile',
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

export const ApiDeleteProfile = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Delete user profile' }),
    ApiBody({
      schema: {
        type: 'object',
        required: ['profileId'],
        properties: {
          profileId: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
            description: 'Profile ID',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Profile deleted successfully',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Profile deleted successfully',
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Profile not found',
      schema: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            example: 'Profile not found',
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
            example: 'Failed to delete profile',
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
