import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service.js';
import { getErrorMessage } from '../../types/supabase.types.js';
import { CreateProfileDto, UpdateProfileDto } from '../../controllers/profile/dto/profile.dto.js';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async createProfile(profileData: CreateProfileDto) {
    this.logger.log(`Creating profile for user: ${profileData.userId}`);

    try {
      const supabase = this.supabaseService.client;
      
      const { data, error } = await supabase
        .from('Profile')
        .insert([{
          user_id: profileData.userId,
          username: profileData.username,
          email: profileData.email,
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          bio: profileData.bio,
          phone: profileData.phone,
          verified: profileData.verified ?? false,
          public: profileData.public ?? true,
          profile_picture: profileData.profilePicture,
          fcm_token: profileData.fcmToken,
          account_name: profileData.accountName,
          show_tutorial: profileData.showTutorial ?? true,
          testing: profileData.testing ?? false
        }])
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create profile: ${error.message}`);
      }

      return data;
    } catch (error) {
      this.logger.error(`Error creating profile: ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getProfile(userId: string) {
    this.logger.log(`Getting profile for user: ${userId}`);

    try {
      const supabase = this.supabaseService.client;
      
      const { data, error } = await supabase
        .from('Profile')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        throw new Error(`Failed to get profile: ${error.message}`);
      }

      return data;
    } catch (error) {
      this.logger.error(`Error getting profile: ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async updateProfile(profileData: UpdateProfileDto) {
    this.logger.log(`Updating profile: ${profileData.id}`);

    try {
      const supabase = this.supabaseService.client;
      
      const { data, error } = await supabase
        .from('Profile')
        .update({
          username: profileData.username,
          email: profileData.email,
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          bio: profileData.bio,
          phone: profileData.phone,
          verified: profileData.verified,
          public: profileData.public,
          profile_picture: profileData.profilePicture,
          fcm_token: profileData.fcmToken,
          account_name: profileData.accountName,
          show_tutorial: profileData.showTutorial,
          testing: profileData.testing
        })
        .eq('id', profileData.id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update profile: ${error.message}`);
      }

      return data;
    } catch (error) {
      this.logger.error(`Error updating profile: ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async deleteProfile(profileId: string) {
    this.logger.log(`Deleting profile: ${profileId}`);

    try {
      const supabase = this.supabaseService.client;
      
      const { error } = await supabase
        .from('Profile')
        .delete()
        .eq('id', profileId);

      if (error) {
        throw new Error(`Failed to delete profile: ${error.message}`);
      }

      return { message: 'Profile deleted successfully' };
    } catch (error) {
      this.logger.error(`Error deleting profile: ${getErrorMessage(error)}`);
      throw error;
    }
  }
} 