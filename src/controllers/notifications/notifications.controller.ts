import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  HttpCode,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { NotificationsService } from '../../services/notifications/notifications.service.js';
import {
  CreateNotificationDto,
  UpdateNotificationDto,
} from './dto/notifications.dto.js';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

interface DeleteResponse {
  message: string;
}

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create notification' })
  @ApiBody({ type: CreateNotificationDto })
  @ApiResponse({
    status: 201,
    description: 'Notification successfully created',
    type: CreateNotificationDto,
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
  async createNotification(
    @Body() createNotificationDto: CreateNotificationDto,
  ): Promise<CreateNotificationDto> {
    try {
      const result = (await (
        this.notificationsService.create as (
          ...args: unknown[]
        ) => Promise<unknown>
      )(createNotificationDto)) as CreateNotificationDto | null;
      if (!result) {
        throw new Error('Failed to create notification');
      }
      return result;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new HttpException(
        {
          error: 'Failed to create notification',
          details: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get notifications' })
  @ApiResponse({
    status: 200,
    description: 'Notifications successfully retrieved',
    type: [CreateNotificationDto],
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
  async getNotifications(
    @Body('userId') userId: string,
  ): Promise<CreateNotificationDto[]> {
    try {
      const result = (await (
        this.notificationsService.findAll as (
          ...args: unknown[]
        ) => Promise<unknown>
      )(userId)) as CreateNotificationDto[];
      return result;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new HttpException(
        {
          error: 'Failed to get notifications',
          details: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update notification' })
  @ApiBody({ type: UpdateNotificationDto })
  @ApiResponse({
    status: 200,
    description: 'Notification successfully updated',
    type: UpdateNotificationDto,
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
  async updateNotification(
    @Body() updateNotificationDto: UpdateNotificationDto,
  ): Promise<UpdateNotificationDto> {
    try {
      const result = (await (
        this.notificationsService.update as (
          ...args: unknown[]
        ) => Promise<unknown>
      )(
        updateNotificationDto.notificationId,
        updateNotificationDto,
      )) as UpdateNotificationDto | null;
      if (!result) {
        throw new Error('Failed to update notification');
      }
      return result;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new HttpException(
        {
          error: 'Failed to update notification',
          details: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete notification' })
  @ApiBody({ type: UpdateNotificationDto })
  @ApiResponse({
    status: 200,
    description: 'Notification successfully deleted',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Notification deleted successfully',
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
  async deleteNotification(
    @Body('notificationId') notificationId: string,
  ): Promise<DeleteResponse> {
    try {
      const result = (await (
        this.notificationsService.remove as (
          ...args: unknown[]
        ) => Promise<unknown>
      )(notificationId)) as DeleteResponse | null;
      if (!result) {
        throw new Error('Failed to delete notification');
      }
      return result;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new HttpException(
        {
          error: 'Failed to delete notification',
          details: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
