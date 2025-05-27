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
  GetNotificationDto,
  DeleteNotificationDto,
} from './dto/notifications.dto.js';
import { getErrorMessage } from '../../types/supabase.types.js';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiCreateNotification,
  ApiGetNotification,
  ApiUpdateNotification,
  ApiDeleteNotification,
} from '../../decorators/swagger/notifications.decorator.js';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreateNotification()
  async createNotification(@Body() createNotificationDto: CreateNotificationDto) {
    try {
      return await this.notificationsService.createNotification(createNotificationDto);
    } catch (error) {
      throw new HttpException(
        {
          error: 'Failed to create notification settings',
          details: getErrorMessage(error),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiGetNotification()
  async getNotifications(@Body() getNotificationDto: GetNotificationDto) {
    try {
      return await this.notificationsService.getNotifications(getNotificationDto.userId);
    } catch (error) {
      throw new HttpException(
        {
          error: 'Failed to get notification settings',
          details: getErrorMessage(error),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @ApiUpdateNotification()
  async updateNotification(@Body() updateNotificationDto: UpdateNotificationDto) {
    try {
      return await this.notificationsService.updateNotification(updateNotificationDto);
    } catch (error) {
      throw new HttpException(
        {
          error: 'Failed to update notification settings',
          details: getErrorMessage(error),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiDeleteNotification()
  async deleteNotification(@Body() deleteNotificationDto: DeleteNotificationDto) {
    try {
      return await this.notificationsService.deleteNotification(deleteNotificationDto.notificationId);
    } catch (error) {
      throw new HttpException(
        {
          error: 'Failed to delete notification settings',
          details: getErrorMessage(error),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
} 