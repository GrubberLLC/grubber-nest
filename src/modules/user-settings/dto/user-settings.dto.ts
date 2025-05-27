import {
  IsString,
  IsBoolean,
  IsArray,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum PrivacyLevel {
  PUBLIC = 'Public',
  FRIENDS = 'Friends',
  PRIVATE = 'Private',
}

export enum PrimaryUsage {
  PERSONAL = 'Personal',
  BUSINESS = 'Business',
  BOTH = 'Both',
}

export enum FrequencyOfReviews {
  DAILY = 'Daily',
  WEEKLY = 'Weekly',
  MONTHLY = 'Monthly',
  OCCASIONALLY = 'Occasionally',
}

export class CreateUserSettingsDto {
  @ApiProperty({ description: 'ID of the user' })
  @IsString()
  user_id!: string;

  @ApiProperty({ description: 'Whether email notifications are enabled' })
  @IsBoolean()
  email_notifications!: boolean;

  @ApiProperty({ description: 'Whether push notifications are enabled' })
  @IsBoolean()
  push_notifications!: boolean;

  @ApiProperty({ description: 'Whether SMS notifications are enabled' })
  @IsBoolean()
  sms_notifications!: boolean;

  @IsEnum(PrivacyLevel)
  @IsOptional()
  privacy_level?: PrivacyLevel = PrivacyLevel.FRIENDS;

  @IsString()
  @IsOptional()
  primary_location?: string;

  @IsBoolean()
  @IsOptional()
  willing_to_travel?: boolean = true;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  preferred_meal_types?: string[] = [];

  @IsEnum(PrimaryUsage)
  @IsOptional()
  primary_usage?: PrimaryUsage;

  @IsEnum(FrequencyOfReviews)
  @IsOptional()
  frequency_of_reviews?: FrequencyOfReviews;

  @IsBoolean()
  @IsOptional()
  receive_notifications?: boolean = true;

  @IsBoolean()
  @IsOptional()
  newsletter_subscription?: boolean = false;
}

export class UpdateUserSettingsDto {
  @ApiProperty({ description: 'Whether email notifications are enabled' })
  @IsBoolean()
  email_notifications?: boolean;

  @ApiProperty({ description: 'Whether push notifications are enabled' })
  @IsBoolean()
  push_notifications?: boolean;

  @ApiProperty({ description: 'Whether SMS notifications are enabled' })
  @IsBoolean()
  sms_notifications?: boolean;
}
