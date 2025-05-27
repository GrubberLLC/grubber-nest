import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateUserSettingsDto,
  UpdateUserSettingsDto,
  PrivacyLevel,
  PrimaryUsage,
  FrequencyOfReviews,
} from './dto/user-settings.dto';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';

export interface UserSettings {
  settings_id: number;
  user_id: number;
  privacy_level: PrivacyLevel;
  primary_location: string;
  willing_to_travel: boolean;
  preferred_meal_types: string[];
  primary_usage: PrimaryUsage;
  frequency_of_reviews: FrequencyOfReviews;
  receive_notifications: boolean;
  newsletter_subscription: boolean;
}

@Injectable()
export class UserSettingsService {
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
    createUserSettingsDto: CreateUserSettingsDto,
  ): Promise<UserSettings> {
    const query = `
      INSERT INTO UserSettings (
        user_id, privacy_level, primary_location, willing_to_travel,
        preferred_meal_types, primary_usage, frequency_of_reviews,
        receive_notifications, newsletter_subscription
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;

    const values = [
      userId,
      createUserSettingsDto.privacy_level,
      createUserSettingsDto.primary_location,
      createUserSettingsDto.willing_to_travel,
      createUserSettingsDto.preferred_meal_types,
      createUserSettingsDto.primary_usage,
      createUserSettingsDto.frequency_of_reviews,
      createUserSettingsDto.receive_notifications,
      createUserSettingsDto.newsletter_subscription,
    ];

    const result = await this.pool.query<UserSettings>(query, values);
    return result.rows[0];
  }

  async findAll(): Promise<UserSettings[]> {
    const query = 'SELECT * FROM UserSettings;';
    const result = await this.pool.query<UserSettings>(query);
    return result.rows;
  }

  async findOne(settingsId: number): Promise<UserSettings> {
    const query = 'SELECT * FROM UserSettings WHERE settings_id = $1;';
    const result = await this.pool.query<UserSettings>(query, [settingsId]);

    if (!result.rows[0]) {
      throw new NotFoundException(`User settings with ID ${settingsId} not found`);
    }

    return result.rows[0];
  }

  async findByUserId(userId: number): Promise<UserSettings> {
    const query = 'SELECT * FROM UserSettings WHERE user_id = $1;';
    const result = await this.pool.query<UserSettings>(query, [userId]);

    if (!result.rows[0]) {
      throw new NotFoundException(`User settings for user ID ${userId} not found`);
    }

    return result.rows[0];
  }

  async update(
    settingsId: number,
    updateUserSettingsDto: UpdateUserSettingsDto,
  ): Promise<UserSettings> {
    const query = `
      UPDATE UserSettings
      SET
        privacy_level = $1,
        primary_location = $2,
        willing_to_travel = $3,
        preferred_meal_types = $4,
        primary_usage = $5,
        frequency_of_reviews = $6,
        receive_notifications = $7,
        newsletter_subscription = $8
      WHERE settings_id = $9
      RETURNING *;
    `;

    const values = [
      updateUserSettingsDto.privacy_level,
      updateUserSettingsDto.primary_location,
      updateUserSettingsDto.willing_to_travel,
      updateUserSettingsDto.preferred_meal_types,
      updateUserSettingsDto.primary_usage,
      updateUserSettingsDto.frequency_of_reviews,
      updateUserSettingsDto.receive_notifications,
      updateUserSettingsDto.newsletter_subscription,
      settingsId,
    ];

    const result = await this.pool.query<UserSettings>(query, values);

    if (!result.rows[0]) {
      throw new NotFoundException(`User settings with ID ${settingsId} not found`);
    }

    return result.rows[0];
  }

  async remove(settingsId: number): Promise<UserSettings> {
    const query = 'DELETE FROM UserSettings WHERE settings_id = $1 RETURNING *;';
    const result = await this.pool.query<UserSettings>(query, [settingsId]);

    if (!result.rows[0]) {
      throw new NotFoundException(`User settings with ID ${settingsId} not found`);
    }

    return result.rows[0];
  }
} 