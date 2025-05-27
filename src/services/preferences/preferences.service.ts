import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service.js';
import { getErrorMessage } from '../../types/supabase.types.js';
import { CreatePreferenceDto, UpdatePreferenceDto } from '../../controllers/preferences/dto/preferences.dto.js';

@Injectable()
export class PreferencesService {
  private readonly logger = new Logger(PreferencesService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async createPreference(preferenceData: CreatePreferenceDto) {
    this.logger.log(`Creating preference for user: ${preferenceData.userId}`);

    try {
      const supabase = this.supabaseService.client;
      
      const { data, error } = await supabase
        .from('UserPreferences')
        .insert([{
          user_id: preferenceData.userId,
          favorite_cuisines: preferenceData.favoriteCuisines,
          least_favorite_cuisines: preferenceData.leastFavoriteCuisines,
          cuisines_willing_to_try: preferenceData.cuisinesWillingToTry,
          diet_type: preferenceData.dietType,
          food_allergies: preferenceData.foodAllergies,
          health_preferences: preferenceData.healthPreferences,
          dietary_restrictions: preferenceData.dietaryRestrictions,
          preferred_meal_types: preferenceData.preferredMealTypes,
          dining_time_preferences: preferenceData.diningTimePreferences,
          meal_occasion_preferences: preferenceData.mealOccasionPreferences,
          preferred_flavors: preferenceData.preferredFlavors,
          disliked_flavors: preferenceData.dislikedFlavors,
          preferred_atmosphere: preferenceData.preferredAtmosphere,
          dining_companions: preferenceData.diningCompanions,
          dining_frequency: preferenceData.diningFrequency,
          primary_location: preferenceData.primaryLocation,
          travel_distance: preferenceData.travelDistance,
          willingness_to_explore: preferenceData.willingnessToExplore,
          rating_criteria: preferenceData.ratingCriteria
        }])
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create preference: ${error.message}`);
      }

      return data;
    } catch (error) {
      this.logger.error(`Error creating preference: ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getPreferences(userId: string) {
    this.logger.log(`Getting preferences for user: ${userId}`);

    try {
      const supabase = this.supabaseService.client;
      
      const { data, error } = await supabase
        .from('UserPreferences')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        throw new Error(`Failed to get preferences: ${error.message}`);
      }

      return data;
    } catch (error) {
      this.logger.error(`Error getting preferences: ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async updatePreference(preferenceData: UpdatePreferenceDto) {
    this.logger.log(`Updating preference: ${preferenceData.preferenceId}`);

    try {
      const supabase = this.supabaseService.client;
      
      const { data, error } = await supabase
        .from('UserPreferences')
        .update({
          favorite_cuisines: preferenceData.favoriteCuisines,
          least_favorite_cuisines: preferenceData.leastFavoriteCuisines,
          cuisines_willing_to_try: preferenceData.cuisinesWillingToTry,
          diet_type: preferenceData.dietType,
          food_allergies: preferenceData.foodAllergies,
          health_preferences: preferenceData.healthPreferences,
          dietary_restrictions: preferenceData.dietaryRestrictions,
          preferred_meal_types: preferenceData.preferredMealTypes,
          dining_time_preferences: preferenceData.diningTimePreferences,
          meal_occasion_preferences: preferenceData.mealOccasionPreferences,
          preferred_flavors: preferenceData.preferredFlavors,
          disliked_flavors: preferenceData.dislikedFlavors,
          preferred_atmosphere: preferenceData.preferredAtmosphere,
          dining_companions: preferenceData.diningCompanions,
          dining_frequency: preferenceData.diningFrequency,
          primary_location: preferenceData.primaryLocation,
          travel_distance: preferenceData.travelDistance,
          willingness_to_explore: preferenceData.willingnessToExplore,
          rating_criteria: preferenceData.ratingCriteria,
          updated_at: new Date().toISOString()
        })
        .eq('preference_id', preferenceData.preferenceId)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update preference: ${error.message}`);
      }

      return data;
    } catch (error) {
      this.logger.error(`Error updating preference: ${getErrorMessage(error)}`);
      throw error;
    }
  } 

  async deletePreference(preferenceId: string) {
    this.logger.log(`Deleting preference: ${preferenceId}`);

    try {
      const supabase = this.supabaseService.client;
      
      const { error } = await supabase
        .from('UserPreferences')
        .delete()
        .eq('preference_id', preferenceId);

      if (error) {
        throw new Error(`Failed to delete preference: ${error.message}`);
      }

      return { message: 'Preference deleted successfully' };
    } catch (error) {
      this.logger.error(`Error deleting preference: ${getErrorMessage(error)}`);
      throw error;
    }
  }
}
