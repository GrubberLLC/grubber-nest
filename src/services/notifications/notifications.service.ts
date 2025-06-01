import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  CreateNotificationDto,
  UpdateNotificationDto,
} from '../../controllers/notifications/dto/notifications.dto.js';
import { SupabaseService } from '../supabase/supabase.service.js';
import {
  PostgrestSingleResponse,
  PostgrestResponse,
} from '@supabase/supabase-js';

export interface Notification {
  id: string;
  user_id: string;
  notification_type: string;
  notification_content: string;
  notification_link?: string;
  is_read: boolean;
  notification_status: string;
  notification_date: string;
}

@Injectable()
export class NotificationsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    const response: PostgrestSingleResponse<Notification> =
      await this.supabaseService.client
        .from('notifications')
        .insert([createNotificationDto])
        .select()
        .single();
    if (response.error || !response.data) {
      throw new InternalServerErrorException(
        response.error?.message || 'Failed to create notification',
      );
    }
    return response.data;
  }

  async findAll(userId: string): Promise<Notification[]> {
    const response: PostgrestResponse<Notification> =
      await this.supabaseService.client
        .from('notifications')
        .select('*')
        .eq('user_id', userId);
    if (response.error) {
      throw new InternalServerErrorException(response.error.message);
    }
    return response.data || [];
  }

  async findUnread(userId: string): Promise<Notification[]> {
    const response: PostgrestResponse<Notification> =
      await this.supabaseService.client
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .eq('is_read', false);
    if (response.error) {
      throw new InternalServerErrorException(response.error.message);
    }
    return response.data || [];
  }

  async markAllAsRead(userId: string): Promise<{ message: string }> {
    const response = await this.supabaseService.client
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId);
    if (response.error) {
      throw new InternalServerErrorException(response.error.message);
    }
    return { message: 'All notifications marked as read' };
  }

  async update(
    id: string,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    const response: PostgrestSingleResponse<Notification> =
      await this.supabaseService.client
        .from('notifications')
        .update(updateNotificationDto)
        .eq('id', id)
        .select()
        .single();
    if (response.error || !response.data) {
      throw new NotFoundException(
        response.error?.message || 'Notification not found',
      );
    }
    return response.data;
  }

  async remove(id: string): Promise<{ message: string }> {
    const response = await this.supabaseService.client
      .from('notifications')
      .delete()
      .eq('id', id);
    if (response.error) {
      throw new NotFoundException(response.error.message);
    }
    return { message: 'Notification deleted successfully' };
  }
}
