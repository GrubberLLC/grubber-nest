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
  allergies?: string[];
  dietaryRestrictions?: string[];
  flavorPreferences?: string[];
  diningPreferences?: string[];
  diningFrequency?: string;
  mealPreference?: string;
}

@Injectable()
export class PreferencesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(
    userId: string,
    favoriteCuisines: string[],
    leastFavoriteCuisines: string[],
    allergies: string[],
    dietaryRestrictions: string[],
    flavorPreferences: string[],
    diningPreferences: string[],
    diningFrequency: string,
    mealPreference: string,
  ): Promise<UserPreferences> {
    Logger.log(`Creating preferences for user: ${userId}`);
    Logger.log(`Favorite cuisines: ${favoriteCuisines.join(', ')}`);
    Logger.log(`Least favorite cuisines: ${leastFavoriteCuisines.join(', ')}`);
    Logger.log(`Allergies: ${allergies.join(', ')}`);
    Logger.log(`Dietary restrictions: ${dietaryRestrictions.join(', ')}`);
    Logger.log(`Flavor preferences: ${flavorPreferences.join(', ')}`);
    Logger.log(`Dining preferences: ${diningPreferences.join(', ')}`);
    Logger.log(`Dining frequency: ${diningFrequency}`);
    Logger.log(`Meal preference: ${mealPreference}`);

    const response = await this.supabaseService.client
      .from('Preferences')
      .insert([
        {
          user_id: userId,
          favorite_cuisines: favoriteCuisines,
          least_favorite_cuisines: leastFavoriteCuisines,
          allergies: allergies,
          dietary_restrictions: dietaryRestrictions,
          flavor_preferences: flavorPreferences,
          dining_preferences: diningPreferences,
          dining_frequency: diningFrequency,
          meal_preference: mealPreference,
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
