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

  async createProfile(
    userId: string,
    username: string,
    email: string,
    firstName: string,
    lastName: string,
    bio: string,
    phone: string,
    location: string,
    profileImage: string,
    longitude: number,
    latitude: number,
  ): Promise<Profile | null> {
    try {
      const supabase = this.supabaseService.client;

      const {
        data,
        error,
      }: { data: Profile | null; error: PostgrestError | null } = await supabase
        .from('Profiles')
        .insert([
          {
            user_id: userId,
            username: username,
            email: email,
            firstName: firstName,
            lastName: lastName,
            bio: bio,
            phone: phone,
            location: location,
            longitude: longitude,
            latitude: latitude,
            verified: false,
            public: true,
            profileImage: profileImage,
            fcmToken: '',
            accountName: firstName + ' ' + lastName,
            showTutorial: true,
            testing: false,
          },
        ])
        .select()
        .single();

      Logger.log(`Data: ${JSON.stringify(data)}`);
      Logger.log(`Error: ${JSON.stringify(error)}`);

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
        .from('Profiles')
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
        .from('Profiles')
        .update({
          username: profileData.username,
          email: profileData.email,
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          bio: profileData.bio,
          phone: profileData.phone,
          verified: profileData.verified,
          public: profileData.public,
          profileImage: profileData.profileImage,
          fcmToken: profileData.fcmToken,
          accountName: profileData.accountName,
          showTutorial: profileData.showTutorial,
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
        .from('Profiles')
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
