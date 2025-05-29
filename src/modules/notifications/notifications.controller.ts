import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service.js';
import {
  CreateNotificationDto,
  UpdateNotificationDto,
} from './dto/notifications.dto.js';
import { JwtAuthGuard } from '../../services/auth/guards/jwt-auth.guard.js';
import { GetUser } from '../../controllers/auth/decorators/get-user.decorator.js';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  create(
    @GetUser('userId') userId: string,
    @Body() createNotificationDto: CreateNotificationDto,
  ) {
    return this.notificationsService.create(userId, createNotificationDto);
  }

  @Get()
  findAll() {
    return this.notificationsService.findAll();
  }

  @Get('me')
  findMyNotifications(@GetUser('userId') userId: string) {
    return this.notificationsService.findByUserId(userId);
  }

  @Get('me/unread')
  findMyUnreadNotifications(@GetUser('userId') userId: string) {
    return this.notificationsService.findUnreadByUserId(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationsService.update(+id, updateNotificationDto);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(+id);
  }

  @Patch('me/read-all')
  markAllAsRead(@GetUser('userId') userId: string) {
    return this.notificationsService.markAllAsRead(userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(+id);
  }
}
