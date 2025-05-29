import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

export const ApiSignup = () => {
  return applyDecorators(
    ApiOperation({ summary: 'User registration' }),
    ApiBody({
      schema: {
        type: 'object',
        required: ['email', 'password', 'username'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'user@example.com',
            description: 'User email address',
          },
          password: {
            type: 'string',
            format: 'password',
            example: '********',
            description: 'User password (min 8 characters)',
          },
          username: {
            type: 'string',
            example: 'johndoe',
            description: 'Unique username',
          },
          firstName: {
            type: 'string',
            example: 'John',
            description: 'User first name',
          },
          lastName: {
            type: 'string',
            example: 'Doe',
            description: 'User last name',
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Registration successful',
      schema: {
        type: 'object',
        properties: {
          access_token: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            description: 'JWT access token',
          },
          refresh_token: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            description: 'JWT refresh token',
          },
          user: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: '123e4567-e89b-12d3-a456-426614174000',
              },
              email: {
                type: 'string',
                example: 'user@example.com',
              },
              username: {
                type: 'string',
                example: 'johndoe',
              },
              role: {
                type: 'string',
                example: 'user',
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid input',
      schema: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            example: 'Email already exists',
          },
          details: {
            type: 'array',
            items: {
              type: 'string',
            },
            example: [
              'email must be a valid email address',
              'password must be at least 8 characters',
            ],
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
            example: 'Internal server error',
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
