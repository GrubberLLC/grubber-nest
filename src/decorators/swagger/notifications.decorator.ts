import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

export const ApiCreateNotification = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Create notification settings' }),
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
          newFollowers: {
            type: 'boolean',
            example: true,
            description: 'Enable notifications for new followers',
            default: true,
          },
          likesAndComments: {
            type: 'boolean',
            example: true,
            description: 'Enable notifications for likes and comments',
            default: true,
          },
          recommendations: {
            type: 'boolean',
            example: true,
            description: 'Enable notifications for recommendations',
            default: true,
          },
          trendingSpots: {
            type: 'boolean',
            example: true,
            description: 'Enable notifications for trending spots',
            default: true,
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Notification settings created successfully',
      schema: {
        type: 'object',
        properties: {
          notification_id: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          user_id: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          new_followers: {
            type: 'boolean',
            example: true,
          },
          likes_and_comments: {
            type: 'boolean',
            example: true,
          },
          recommendations: {
            type: 'boolean',
            example: true,
          },
          trending_spots: {
            type: 'boolean',
            example: true,
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
            example: 'Failed to create notification settings',
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

export const ApiGetNotification = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Get notification settings' }),
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
      description: 'Notification settings retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          notification_id: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          user_id: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          new_followers: {
            type: 'boolean',
            example: true,
          },
          likes_and_comments: {
            type: 'boolean',
            example: true,
          },
          recommendations: {
            type: 'boolean',
            example: true,
          },
          trending_spots: {
            type: 'boolean',
            example: true,
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Notification settings not found',
      schema: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            example: 'Notification settings not found',
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
            example: 'Failed to get notification settings',
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

export const ApiUpdateNotification = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Update notification settings' }),
    ApiBody({
      schema: {
        type: 'object',
        required: ['notificationId'],
        properties: {
          notificationId: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
            description: 'Notification settings ID',
          },
          userId: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
            description: 'User ID',
          },
          newFollowers: {
            type: 'boolean',
            example: true,
            description: 'Enable notifications for new followers',
          },
          likesAndComments: {
            type: 'boolean',
            example: true,
            description: 'Enable notifications for likes and comments',
          },
          recommendations: {
            type: 'boolean',
            example: true,
            description: 'Enable notifications for recommendations',
          },
          trendingSpots: {
            type: 'boolean',
            example: true,
            description: 'Enable notifications for trending spots',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Notification settings updated successfully',
      schema: {
        type: 'object',
        properties: {
          notification_id: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          user_id: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          new_followers: {
            type: 'boolean',
            example: true,
          },
          likes_and_comments: {
            type: 'boolean',
            example: true,
          },
          recommendations: {
            type: 'boolean',
            example: true,
          },
          trending_spots: {
            type: 'boolean',
            example: true,
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Notification settings not found',
      schema: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            example: 'Notification settings not found',
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
            example: 'Failed to update notification settings',
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

export const ApiDeleteNotification = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Delete notification settings' }),
    ApiBody({
      schema: {
        type: 'object',
        required: ['notificationId'],
        properties: {
          notificationId: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
            description: 'Notification settings ID',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Notification settings deleted successfully',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Notification settings deleted successfully',
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Notification settings not found',
      schema: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            example: 'Notification settings not found',
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
            example: 'Failed to delete notification settings',
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
