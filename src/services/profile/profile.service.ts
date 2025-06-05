import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service.js';
import { getErrorMessage } from '../../types/supabase.types.js';
import {
  CreateProfileDto,
  UpdateProfileDto,
} from '../../controllers/profile/dto/profile.dto.js';
import { PostgrestResponse, PostgrestError } from '@supabase/supabase-js';

interface Profile {
  userId: string;
  username?: string | null;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  bio?: string | null;
  phone?: string | null;
  location?: string | null;
  profileImage?: string | null;
  longitude?: number | null;
  latitude?: number | null;
}

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async createProfile(profileData: CreateProfileDto): Promise<Profile | null> {
    this.logger.log(`Creating profile for user: ${profileData.userId}`);

    try {
      const supabase = this.supabaseService.client;

      const {
        data,
        error,
      }: { data: Profile | null; error: PostgrestError | null } = await supabase
        .from('Profile')
        .insert([
          {
            userId: profileData.userId,
            username: profileData.username,
            email: profileData.email,
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            bio: profileData.bio,
            phone: profileData.phone,
            location: profileData.location,
            longitude: profileData.longitude,
            latitude: profileData.latitude,
            verified: false,
            public: true,
            profileImage: profileData.profileImage,
            fcmToken: '',
            accountName: profileData.firstName + ' ' + profileData.lastName,
            showTutorial: true,
            testing: false,
          },
        ])
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

  async getProfile(userId: string): Promise<Profile | null> {
    this.logger.log(`Getting profile for user: ${userId}`);

    try {
      const supabase = this.supabaseService.client;

      const {
        data,
        error,
      }: { data: Profile | null; error: PostgrestError | null } = await supabase
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

  async updateProfile(profileData: UpdateProfileDto): Promise<Profile | null> {
    this.logger.log(`Updating profile: ${profileData.id}`);

    try {
      const supabase = this.supabaseService.client;

      const {
        data,
        error,
      }: { data: Profile | null; error: PostgrestError | null } = await supabase
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
          testing: profileData.testing,
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

  async deleteProfile(profileId: string): Promise<{ message: string }> {
    this.logger.log(`Deleting profile: ${profileId}`);

    try {
      const supabase = this.supabaseService.client;

      const { error } = (await supabase
        .from('Profile')
        .delete()
        .eq('id', profileId)) as PostgrestResponse<null>; // Ensuring delete response is typed

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
