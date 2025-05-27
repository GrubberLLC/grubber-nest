import { Injectable } from '@nestjs/common';
import { CreateNotificationDto, UpdateNotificationDto } from '../../controllers/notifications/dto/notifications.dto.js';
import { SupabaseService } from '../supabase/supabase.service.js';


@Injectable()
export class NotificationsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async createNotification(notificationData: CreateNotificationDto) {
    try {
      const supabase = this.supabaseService.client;
      const { data, error } = await supabase
        .from('Notifications')
        .insert([
          {
            user_id: notificationData.userId,
            new_followers: notificationData.newFollowers ?? true,
            likes_and_comments: notificationData.likesAndComments ?? true,
            recommendations: notificationData.recommendations ?? true,
            trending_spots: notificationData.trendingSpots ?? true,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating notification settings:', error);
      throw error;
    }
  }

  async getNotifications(userId: string) {
    try {
      const supabase = this.supabaseService.client;
      const { data, error } = await supabase
        .from('Notifications')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting notification settings:', error);
      throw error;
    }
  }

  async updateNotification(notificationData: UpdateNotificationDto) {
    try {
      const supabase = this.supabaseService.client;
      const { data, error } = await supabase
        .from('Notifications')
        .update({
          user_id: notificationData.userId,
          new_followers: notificationData.newFollowers,
          likes_and_comments: notificationData.likesAndComments,
          recommendations: notificationData.recommendations,
          trending_spots: notificationData.trendingSpots,
        })
        .eq('notification_id', notificationData.notificationId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw error;
    }
  }

  async deleteNotification(notificationId: string) {
    try {
      const supabase = this.supabaseService.client;
      const { error } = await supabase
        .from('Notifications')
        .delete()
        .eq('notification_id', notificationId);

      if (error) throw error;
      return { message: 'Notification settings deleted successfully' };
    } catch (error) {
      console.error('Error deleting notification settings:', error);
      throw error;
    }
  }
} 