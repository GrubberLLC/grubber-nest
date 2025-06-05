import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service.js';
import { getErrorMessage } from '../../types/supabase.types.js';
import {
  CreateSettingsDto,
  UpdateSettingsDto,
} from '../../controllers/settings/dto/settings.dto.js';
import { PostgrestResponse, PostgrestError } from '@supabase/supabase-js';

interface UserSettings {
  settings_id: string;
  user_id: string;
  privacy_level?: string | null;
  primary_location?: string | null;
  primary_usage?: string | null;
  receive_notifications?: boolean | null;
  newsletter_subscription?: boolean | null;
}

@Injectable()
export class SettingsService {
  private readonly logger = new Logger(SettingsService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async createSettings(
    userId: string,
    primaryLocation: string,
  ): Promise<UserSettings | null> {
    this.logger.log(`Creating settings for user: ${userId}`);

    try {
      const supabase = this.supabaseService.client;

      const {
        data,
        error,
      }: { data: UserSettings | null; error: PostgrestError | null } =
        await supabase
          .from('UserSettings')
          .insert([
            {
              user_id: userId,
              privacy_level: 'Public',
              primary_location: primaryLocation,
              primary_usage: 'All',
              receive_notifications: true,
              newsletter_subscription: true,
            },
          ])
          .select()
          .single();

      if (error) {
        throw new Error(`Failed to create settings: ${error.message}`);
      }

      return data;
    } catch (error) {
      this.logger.error(`Error creating settings: ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getSettings(userId: string): Promise<UserSettings[] | null> {
    this.logger.log(`Getting settings for user: ${userId}`);

    try {
      const supabase = this.supabaseService.client;

      const {
        data,
        error,
      }: { data: UserSettings[] | null; error: PostgrestError | null } =
        await supabase.from('UserSettings').select('*').eq('user_id', userId);

      if (error) {
        throw new Error(`Failed to get settings: ${error.message}`);
      }

      return data;
    } catch (error) {
      this.logger.error(`Error getting settings: ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async updateSettings(
    settingsData: UpdateSettingsDto,
  ): Promise<UserSettings | null> {
    this.logger.log(`Updating settings: ${settingsData.settingsId}`);

    try {
      const supabase = this.supabaseService.client;

      const {
        data,
        error,
      }: { data: UserSettings | null; error: PostgrestError | null } =
        await supabase
          .from('UserSettings')
          .update({
            privacy_level: settingsData.privacyLevel,
            primary_location: settingsData.primaryLocation,
            willing_to_travel: settingsData.willingToTravel,
            preferred_meal_types: settingsData.preferredMealTypes,
            primary_usage: settingsData.primaryUsage,
            frequency_of_reviews: settingsData.frequencyOfReviews,
            receive_notifications: settingsData.receiveNotifications,
            newsletter_subscription: settingsData.newsletterSubscription,
          })
          .eq('settings_id', settingsData.settingsId)
          .select()
          .single();

      if (error) {
        throw new Error(`Failed to update settings: ${error.message}`);
      }

      return data;
    } catch (error) {
      this.logger.error(`Error updating settings: ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async deleteSettings(settingsId: string): Promise<{ message: string }> {
    this.logger.log(`Deleting settings: ${settingsId}`);

    try {
      const supabase = this.supabaseService.client;

      const { error } = (await supabase
        .from('UserSettings')
        .delete()
        .eq('settings_id', settingsId)) as PostgrestResponse<null>;

      if (error) {
        throw new Error(`Failed to delete settings: ${error.message}`);
      }

      return { message: 'Settings deleted successfully' };
    } catch (error) {
      this.logger.error(`Error deleting settings: ${getErrorMessage(error)}`);
      throw error;
    }
  }
}
