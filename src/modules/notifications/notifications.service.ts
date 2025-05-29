import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateNotificationDto,
  UpdateNotificationDto,
} from './dto/notifications.dto.js';
import { SupabaseService } from '../../services/supabase/supabase.service.js';
import {
  PostgrestSingleResponse,
  PostgrestResponse,
} from '@supabase/supabase-js';

export interface Notification {
  id: number;
  user_id: string;
  notification_type: string;
  notification_content: string;
  notification_link?: string;
  is_read: boolean;
  notification_status: string;
  notification_date: string;
  created_at: string;
  updated_at: string;
}

@Injectable()
export class NotificationsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(
    userId: string,
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    const response = await this.supabaseService.client
      .from('notifications')
      .insert({
        user_id: userId,
        ...createNotificationDto,
      })
      .select()
      .single();

    console.log(response);

    const { data, error } = response as PostgrestSingleResponse<Notification>;

    if (error) throw error;
    return data;
  }

  async findAll(): Promise<Notification[]> {
    const response = await this.supabaseService.client
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });

    const { data, error } = response as PostgrestResponse<Notification>;

    console.log(data);

    if (error) throw error;
    return data;
  }

  async findOne(id: number): Promise<Notification> {
    const response = await this.supabaseService.client
      .from('notifications')
      .select('*')
      .eq('id', id)
      .single();

    const { data, error } = response as PostgrestSingleResponse<Notification>;

    if (error || !data) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    return data;
  }

  async findByUserId(userId: string): Promise<Notification[]> {
    const response = await this.supabaseService.client
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    const { data, error } = response as PostgrestResponse<Notification>;

    if (error) throw error;
    return data;
  }

  async findUnreadByUserId(userId: string): Promise<Notification[]> {
    const response = await this.supabaseService.client
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('is_read', false)
      .order('created_at', { ascending: false });

    const { data, error } = response as PostgrestResponse<Notification>;

    if (error) throw error;
    return data;
  }

  async update(
    id: number,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    const response = await this.supabaseService.client
      .from('notifications')
      .update(updateNotificationDto)
      .eq('id', id)
      .select()
      .single();

    const { data, error } = response as PostgrestSingleResponse<Notification>;

    if (error || !data) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    return data;
  }

  async markAsRead(id: number): Promise<Notification> {
    const response = await this.supabaseService.client
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .select()
      .single();

    const { data, error } = response as PostgrestSingleResponse<Notification>;

    if (error || !data) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    return data;
  }

  async markAllAsRead(userId: string): Promise<Notification[]> {
    const response = await this.supabaseService.client
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false)
      .select();

    const { data, error } = response as PostgrestResponse<Notification>;

    if (error) throw error;
    return data;
  }

  async remove(id: number): Promise<Notification> {
    const response = await this.supabaseService.client
      .from('notifications')
      .delete()
      .eq('id', id)
      .select()
      .single();

    const { data, error } = response as PostgrestSingleResponse<Notification>;

    if (error || !data) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    return data;
  }
}
