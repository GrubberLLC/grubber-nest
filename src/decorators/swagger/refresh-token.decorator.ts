import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

export const ApiRefreshToken = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Refresh access token' }),
    ApiBody({
      schema: {
        type: 'object',
        required: ['refresh_token'],
        properties: {
          refresh_token: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            description: 'JWT refresh token',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Token refresh successful',
      schema: {
        type: 'object',
        properties: {
          access_token: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            description: 'New JWT access token',
          },
          refresh_token: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            description: 'New JWT refresh token',
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Invalid refresh token',
      schema: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            example: 'Invalid refresh token',
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
