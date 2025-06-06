import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service.js';
import {
  CreatePreferencesDto,
  UpdatePreferencesDto,
} from '../../controllers/preferences/dto/preferences.dto.js';
import { PostgrestResponse } from '@supabase/supabase-js';

export interface UserPreferences {
  userId: string;
  favoriteCuisines?: string[];
  leastFavoriteCuisines?: string[];
  foodAllergies?: string[];
  dietaryRestrictions?: string[];
  flavorPreferences?: string[];
  diningPreferences?: string[];
  diningFrequency?: string;
  mealPreference?: string;
}

@Injectable()
export class PreferencesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  // userId,
  //         favoriteCuisines,
  //         leastFavoriteCuisines,
  //         foodAlergies: allergies,
  //         dietType: 'vegam',
  //         dietaryRestrictions,
  //         flavorPreferences,
  //         diningPreferences,
  //         diningFrequency,
  //         mealPreference,
  async create(dto: CreatePreferencesDto): Promise<UserPreferences> {
    const response = await this.supabaseService.client
      .from('Preferences')
      .insert([
        {
          user_id: dto.userId,
          favorite_cuisines: dto.favoriteCuisines?.join(',') ?? null,
          least_favorite_cuisines: dto.leastFavoriteCuisines?.join(',') ?? null,
          food_allergies: dto.foodAllergies?.join(',') ?? null,
          diet_type: dto.dietType?.join(',') ?? null,
          dietary_restrictions: dto.dietaryRestrictions?.join(',') ?? null,
          preferred_atmosphere: dto.preferredAtmosphere?.join(',') ?? null,
          dining_frequency: dto.diningFrequency ?? null,
          meal_preference: dto.preferredAtmosphere ?? null,
          flavor_preferences: dto.flavorPreferences?.join(',') ?? null,
        },
      ])
      .select()
      .single();
    Logger.log(`Response: ${JSON.stringify(response)}`);
    if (response.error || !response.data) {
      throw new InternalServerErrorException(
        response.error?.message || 'Failed to create preferences',
      );
    }
    Logger.log(
      `Preferences created successfully: ${JSON.stringify(response.data)}`,
    );
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
