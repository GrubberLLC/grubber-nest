import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service.js';
import {
  UpdatePreferencesDto,
  CreatePreferencesDto,
} from '../../controllers/preferences/dto/preferences.dto.js';
import { PostgrestResponse } from '@supabase/supabase-js';

export interface UserPreferences {
  user_id: string;
  favorite_cuisines?: string[];
  least_favorite_cuisines?: string[];
  diet?: string[];
  allergies?: string[];
  dietary_restrictions?: string[];
  occasion?: string[];
  meal_preferences?: string[];
  dining_time?: string;
  flavor?: string[];
  least_flavors?: string[];
  atmosphere?: string[];
  travel_distance?: string;
  frequency?: string;
  explore?: boolean;
  rating_criteria?: string;
}

@Injectable()
export class PreferencesService {
  constructor(private readonly supabaseService: SupabaseService) {}
  async create(dto: CreatePreferencesDto): Promise<UserPreferences> {
    const response = await this.supabaseService.client
      .from('Preferences')
      .insert([
        {
          user_id: dto.userId,
          favorite_cuisines: dto.favorite_cuisines?.join(',') ?? null,
          least_favorite_cuisines:
            dto.least_favorite_cuisines?.join(',') ?? null,
          allergies: dto.allergies?.join(',') ?? null,
          diet: dto.diet?.join(',') ?? null,
          dietary_restrictions: dto.dietary_restrictions?.join(',') ?? null,
          flavor: dto.flavor?.join(',') ?? null,
          least_flavors: dto.least_flavors?.join(',') ?? null,
          atmosphere: dto.atmosphere?.join(',') ?? null,
          frequency: dto.frequency ?? null,
          meal_preference: dto.meal_preference?.join(',') ?? null,
          dining_time: dto.dining_time ?? null,
          travel_distance: dto.travel_distance ?? null,
          explore: dto.explore ?? null,
          rating_criteria: dto.rating_criteria ?? null,
        },
      ])
      .select()
      .single();
    if (response.error || !response.data) {
      throw new InternalServerErrorException(
        response.error?.message || 'Failed to create preferences',
      );
    }
    return response.data as UserPreferences;
  }

  async update(
    id: string,
    updateUserPreferencesDto: UpdatePreferencesDto,
  ): Promise<UserPreferences> {
    const response = await this.supabaseService.client
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
    return response.data as UserPreferences;
  }

  async findAll(userId: string): Promise<UserPreferences[]> {
    const response = (await this.supabaseService.client
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)) as PostgrestResponse<UserPreferences>;
    if (response.error) {
      throw new InternalServerErrorException(response.error.message);
    }
    return response.data || [];
  }

  async findOne(id: string): Promise<UserPreferences> {
    const response = await this.supabaseService.client
      .from('user_preferences')
      .select('*')
      .eq('id', id)
      .single();
    if (response.error || !response.data) {
      throw new NotFoundException(
        response.error?.message || 'Preferences not found',
      );
    }
    return response.data as UserPreferences;
  }

  async remove(id: string): Promise<{ message: string }> {
    const response = (await this.supabaseService.client
      .from('user_preferences')
      .delete()
      .eq('id', id)) as PostgrestResponse<null>;
    if (response.error) {
      throw new NotFoundException(response.error.message);
    }
    return { message: 'Preferences deleted successfully' };
  }
}
