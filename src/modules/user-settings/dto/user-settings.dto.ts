import { IsString, IsBoolean, IsArray, IsEnum, IsOptional } from 'class-validator';

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

export class UpdateUserSettingsDto extends CreateUserSettingsDto {} 