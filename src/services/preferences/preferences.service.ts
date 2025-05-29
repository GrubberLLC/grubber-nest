import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service.js';
import {
  CreateUserPreferencesDto,
  UpdateUserPreferencesDto,
} from '../../controllers/preferences/dto/preferences.dto.js';
import {
  PostgrestSingleResponse,
  PostgrestResponse,
} from '@supabase/supabase-js';

export interface UserPreferences {
  id: string;
  user_id: string;
  dietary_restrictions?: string[];
  favorite_cuisines?: string[];
  price_range?: string;
  preferred_radius?: number;
  theme?: string;
  language?: string;
  notifications_enabled?: boolean;
}

@Injectable()
export class PreferencesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(
    createUserPreferencesDto: CreateUserPreferencesDto,
  ): Promise<UserPreferences> {
    const response: PostgrestSingleResponse<UserPreferences> =
      await this.supabaseService.client
        .from('user_preferences')
        .insert([createUserPreferencesDto])
        .select()
        .single();
    if (response.error || !response.data) {
      throw new InternalServerErrorException(
        response.error?.message || 'Failed to create preferences',
      );
    }
    return response.data;
  }

  async update(
    id: string,
    updateUserPreferencesDto: UpdateUserPreferencesDto,
  ): Promise<UserPreferences> {
    const response: PostgrestSingleResponse<UserPreferences> =
      await this.supabaseService.client
        .from('user_preferences')
        .update(updateUserPreferencesDto)
        .eq('id', id)
        .select()
        .single();
    if (response.error || !response.data) {
      throw new NotFoundException(
        response.error?.message || 'Preferences not found',
      );
    }
    return response.data;
  }

  async findAll(userId: string): Promise<UserPreferences[]> {
    const response: PostgrestResponse<UserPreferences> =
      await this.supabaseService.client
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId);
    if (response.error) {
      throw new InternalServerErrorException(response.error.message);
    }
    return response.data || [];
  }

  async findOne(id: string): Promise<UserPreferences> {
    const response: PostgrestSingleResponse<UserPreferences> =
      await this.supabaseService.client
        .from('user_preferences')
        .select('*')
        .eq('id', id)
        .single();
    if (response.error || !response.data) {
      throw new NotFoundException(
        response.error?.message || 'Preferences not found',
      );
    }
    return response.data;
  }

  async remove(id: string): Promise<{ message: string }> {
    const response = await this.supabaseService.client
      .from('user_preferences')
      .delete()
      .eq('id', id);
    if (response.error) {
      throw new NotFoundException(response.error.message);
    }
    return { message: 'Preferences deleted successfully' };
  }
}
