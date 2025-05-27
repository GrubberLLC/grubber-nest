import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserPreferencesDto, UpdateUserPreferencesDto } from './dto/user-preferences.dto';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';

export interface UserPreferences {
  preference_id: number;
  user_id: number;
  favorite_cuisines: string[];
  least_favorite_cuisines: string[];
  cuisines_willing_to_try: string[];
  diet_type: string;
  food_allergies: string[];
  health_preferences: string[];
  dietary_restrictions: string[];
  preferred_meal_types: string[];
  dining_time_preferences: string[];
  meal_occasion_preferences: string[];
  preferred_flavors: string[];
  disliked_flavors: string[];
  preferred_atmosphere: string[];
  dining_companions: string[];
  dining_frequency: string;
  primary_location: string;
  travel_distance: string;
  willingness_to_explore: string;
  rating_criteria: string[];
  created_at: Date;
  updated_at: Date;
}

@Injectable()
export class UserPreferencesService {
  private pool: Pool;

  constructor(private configService: ConfigService) {
    this.pool = new Pool({
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      user: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_DATABASE'),
    });
  }

  async create(
    userId: number,
    createUserPreferencesDto: CreateUserPreferencesDto,
  ): Promise<UserPreferences> {
    const query = `
      INSERT INTO UserPreferences (
        user_id, favorite_cuisines, least_favorite_cuisines, cuisines_willing_to_try,
        diet_type, food_allergies, health_preferences, dietary_restrictions,
        preferred_meal_types, dining_time_preferences, meal_occasion_preferences,
        preferred_flavors, disliked_flavors, preferred_atmosphere, dining_companions,
        dining_frequency, primary_location, travel_distance, willingness_to_explore,
        rating_criteria
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
      RETURNING *;
    `;

    const values = [
      userId,
      createUserPreferencesDto.favorite_cuisines,
      createUserPreferencesDto.least_favorite_cuisines,
      createUserPreferencesDto.cuisines_willing_to_try,
      createUserPreferencesDto.diet_type,
      createUserPreferencesDto.food_allergies,
      createUserPreferencesDto.health_preferences,
      createUserPreferencesDto.dietary_restrictions,
      createUserPreferencesDto.preferred_meal_types,
      createUserPreferencesDto.dining_time_preferences,
      createUserPreferencesDto.meal_occasion_preferences,
      createUserPreferencesDto.preferred_flavors,
      createUserPreferencesDto.disliked_flavors,
      createUserPreferencesDto.preferred_atmosphere,
      createUserPreferencesDto.dining_companions,
      createUserPreferencesDto.dining_frequency,
      createUserPreferencesDto.primary_location,
      createUserPreferencesDto.travel_distance,
      createUserPreferencesDto.willingness_to_explore,
      createUserPreferencesDto.rating_criteria,
    ];

    const result = await this.pool.query<UserPreferences>(query, values);
    return result.rows[0];
  }

  async findAll(): Promise<UserPreferences[]> {
    const query = 'SELECT * FROM UserPreferences;';
    const result = await this.pool.query<UserPreferences>(query);
    return result.rows;
  }

  async findOne(preferenceId: number): Promise<UserPreferences> {
    const query = 'SELECT * FROM UserPreferences WHERE preference_id = $1;';
    const result = await this.pool.query<UserPreferences>(query, [preferenceId]);
    
    if (!result.rows[0]) {
      throw new NotFoundException(`User preferences with ID ${preferenceId} not found`);
    }
    
    return result.rows[0];
  }

  async findByUserId(userId: number): Promise<UserPreferences> {
    const query = 'SELECT * FROM UserPreferences WHERE user_id = $1;';
    const result = await this.pool.query<UserPreferences>(query, [userId]);
    
    if (!result.rows[0]) {
      throw new NotFoundException(`User preferences for user ID ${userId} not found`);
    }
    
    return result.rows[0];
  }

  async update(
    preferenceId: number,
    updateUserPreferencesDto: UpdateUserPreferencesDto,
  ): Promise<UserPreferences> {
    const query = `
      UPDATE UserPreferences
      SET
        favorite_cuisines = $1,
        least_favorite_cuisines = $2,
        cuisines_willing_to_try = $3,
        diet_type = $4,
        food_allergies = $5,
        health_preferences = $6,
        dietary_restrictions = $7,
        preferred_meal_types = $8,
        dining_time_preferences = $9,
        meal_occasion_preferences = $10,
        preferred_flavors = $11,
        disliked_flavors = $12,
        preferred_atmosphere = $13,
        dining_companions = $14,
        dining_frequency = $15,
        primary_location = $16,
        travel_distance = $17,
        willingness_to_explore = $18,
        rating_criteria = $19,
        updated_at = CURRENT_TIMESTAMP
      WHERE preference_id = $20
      RETURNING *;
    `;

    const values = [
      updateUserPreferencesDto.favorite_cuisines,
      updateUserPreferencesDto.least_favorite_cuisines,
      updateUserPreferencesDto.cuisines_willing_to_try,
      updateUserPreferencesDto.diet_type,
      updateUserPreferencesDto.food_allergies,
      updateUserPreferencesDto.health_preferences,
      updateUserPreferencesDto.dietary_restrictions,
      updateUserPreferencesDto.preferred_meal_types,
      updateUserPreferencesDto.dining_time_preferences,
      updateUserPreferencesDto.meal_occasion_preferences,
      updateUserPreferencesDto.preferred_flavors,
      updateUserPreferencesDto.disliked_flavors,
      updateUserPreferencesDto.preferred_atmosphere,
      updateUserPreferencesDto.dining_companions,
      updateUserPreferencesDto.dining_frequency,
      updateUserPreferencesDto.primary_location,
      updateUserPreferencesDto.travel_distance,
      updateUserPreferencesDto.willingness_to_explore,
      updateUserPreferencesDto.rating_criteria,
      preferenceId,
    ];

    const result = await this.pool.query<UserPreferences>(query, values);
    
    if (!result.rows[0]) {
      throw new NotFoundException(`User preferences with ID ${preferenceId} not found`);
    }
    
    return result.rows[0];
  }

  async remove(preferenceId: number): Promise<UserPreferences> {
    const query = 'DELETE FROM UserPreferences WHERE preference_id = $1 RETURNING *;';
    const result = await this.pool.query<UserPreferences>(query, [preferenceId]);
    
    if (!result.rows[0]) {
      throw new NotFoundException(`User preferences with ID ${preferenceId} not found`);
    }
    
    return result.rows[0];
  }
} 