import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsArray, IsOptional } from 'class-validator';

export class CreatePreferencesDto {
  @ApiProperty({ description: 'User ID', example: '123' })
  @IsString()
  userId!: string;

  @ApiProperty({
    description: 'Favorite cuisines',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  favoriteCuisines?: string[];

  @ApiProperty({
    description: 'Least favorite cuisines',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  leastFavoriteCuisines?: string[];

  @ApiProperty({
    description: 'Cuisines willing to try',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  cuisinesWillingToTry?: string[];

  @ApiProperty({
    description: 'Diet type',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  dietType?: string[];

  @ApiProperty({
    description: 'Food allergies',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  foodAllergies?: string[];

  @ApiProperty({
    description: 'Health preferences',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  healthPreferences?: string[];

  @ApiProperty({
    description: 'Dietary restrictions',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  dietaryRestrictions?: string[];

  @ApiProperty({
    description: 'Preferred meal types',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  preferredMealTypes?: string[];

  @ApiProperty({
    description: 'Dining time preferences',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  diningTimePreferences?: string[];

  @ApiProperty({
    description: 'Meal occasion preferences',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  mealOccasionPreferences?: string[];

  @ApiProperty({
    description: 'Preferred flavors',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  preferredFlavors?: string[];

  @ApiProperty({
    description: 'Disliked flavors',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  dislikedFlavors?: string[];

  @ApiProperty({
    description: 'Preferred atmosphere',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  preferredAtmosphere?: string[];

  @ApiProperty({
    description: 'Dining companions',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  diningCompanions?: string[];

  @ApiProperty({
    description: 'Dining frequency',
    type: [String],
    required: false,
  })
  @IsString()
  @IsOptional()
  diningFrequency?: string;

  @ApiProperty({
    description: 'Primary location',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  primaryLocation?: string[];

  @ApiProperty({
    description: 'Travel distance',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  travelDistance?: string[];

  @ApiProperty({
    description: 'Willingness to explore',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  willingnessToExplore?: string[];

  @ApiProperty({
    description: 'Rating criteria',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  ratingCriteria?: string[];
}

export class UpdatePreferencesDto {
  @ApiProperty({ description: 'User theme preference' })
  @IsString()
  theme?: string;

  @ApiProperty({ description: 'User language preference' })
  @IsString()
  language?: string;

  @ApiProperty({ description: 'Whether notifications are enabled' })
  @IsBoolean()
  notifications_enabled?: boolean;
}

export class CreatePreferenceDto {
  @ApiProperty({ description: 'User ID', example: '123' })
  @IsString()
  userId!: string;

  @ApiProperty({
    description: 'Favorite cuisines',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  favoriteCuisines?: string[];

  @ApiProperty({
    description: 'Least favorite cuisines',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  leastFavoriteCuisines?: string[];

  @ApiProperty({
    description: 'Cuisines willing to try',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  cuisinesWillingToTry?: string[];

  @ApiProperty({
    description: 'Diet type',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  dietType?: string[];

  @ApiProperty({
    description: 'Food allergies',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  foodAllergies?: string[];

  @ApiProperty({
    description: 'Health preferences',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  healthPreferences?: string[];

  @ApiProperty({
    description: 'Dietary restrictions',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  dietaryRestrictions?: string[];

  @ApiProperty({
    description: 'Preferred meal types',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  preferredMealTypes?: string[];

  @ApiProperty({
    description: 'Dining time preferences',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  diningTimePreferences?: string[];

  @ApiProperty({
    description: 'Meal occasion preferences',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  mealOccasionPreferences?: string[];

  @ApiProperty({
    description: 'Preferred flavors',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  preferredFlavors?: string[];

  @ApiProperty({
    description: 'Disliked flavors',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  dislikedFlavors?: string[];

  @ApiProperty({
    description: 'Preferred atmosphere',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  preferredAtmosphere?: string[];

  @ApiProperty({
    description: 'Dining companions',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  diningCompanions?: string[];

  @ApiProperty({
    description: 'Dining frequency',
    type: [String],
    required: false,
  })
  @IsString()
  @IsOptional()
  diningFrequency?: string;

  @ApiProperty({
    description: 'Primary location',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  primaryLocation?: string[];

  @ApiProperty({
    description: 'Travel distance',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  travelDistance?: string[];

  @ApiProperty({
    description: 'Willingness to explore',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  willingnessToExplore?: string[];

  @ApiProperty({
    description: 'Rating criteria',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  ratingCriteria?: string[];
}

export class UpdatePreferenceDto extends CreatePreferenceDto {
  @ApiProperty({
    description: 'Preference ID',
    example: 1,
    required: true,
  })
  @IsString()
  preferenceId!: string;
}

export class GetPreferenceDto {
  @ApiProperty({
    description: 'User ID',
    example: 1,
    required: true,
  })
  @IsString()
  userId!: string;
}

export class DeletePreferenceDto {
  @ApiProperty({
    description: 'Preference ID',
    example: 1,
    required: true,
  })
  @IsString()
  preferenceId!: string;
}
