import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsArray, IsOptional } from 'class-validator';

export class CreatePreferencesDto {
  @ApiProperty({ description: 'ID of the user' })
  @IsString()
  user_id!: string;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ description: 'User theme preference' })
  favorite_cuisines?: string[] = [];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  least_favorite_cuisines?: string[] = [];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  cuisines_willing_to_try?: string[] = [];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  diet_type?: string[] = [];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  food_allergies?: string[] = [];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  health_preferences?: string[] = [];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  dietary_restrictions?: string[] = [];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  preferred_meal_types?: string[] = [];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  dining_time_preferences?: string[] = [];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  meal_occasion_preferences?: string[] = [];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  preferred_flavors?: string[] = [];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  disliked_flavors?: string[] = [];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  preferred_atmosphere?: string[] = [];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  dining_companions?: string[] = [];

  @IsString()
  @IsOptional()
  dining_frequency?: string;

  @IsString()
  @IsOptional()
  primary_location?: string;

  @IsString()
  @IsOptional()
  travel_distance?: string;

  @IsString()
  @IsOptional()
  willingness_to_explore?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  rating_criteria?: string[] = [];
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
  @ApiProperty({
    description: 'User ID',
    example: 1,
    required: true,
  })
  @IsString()
  userId!: string;

  @ApiProperty({
    description: 'Favorite cuisines',
    example: ['Italian', 'Japanese', 'Mexican'],
    required: false,
    type: [String],
  })
  @IsArray()
  @IsOptional()
  favoriteCuisines?: string[];

  @ApiProperty({
    description: 'Least favorite cuisines',
    example: ['Thai', 'Indian'],
    required: false,
    type: [String],
  })
  @IsArray()
  @IsOptional()
  leastFavoriteCuisines?: string[];

  @ApiProperty({
    description: 'Cuisines willing to try',
    example: ['Korean', 'Ethiopian'],
    required: false,
    type: [String],
  })
  @IsArray()
  @IsOptional()
  cuisinesWillingToTry?: string[];

  @ApiProperty({
    description: 'Diet type',
    example: 'Vegetarian',
    required: true,
  })
  @IsString()
  dietType!: string;

  @ApiProperty({
    description: 'Food allergies',
    example: ['Peanuts', 'Shellfish'],
    required: true,
    type: [String],
  })
  @IsArray()
  allergies!: string[];

  @ApiProperty({
    description: 'Health preferences',
    example: ['Low-carb', 'High-protein'],
    required: false,
    type: [String],
  })
  @IsArray()
  @IsOptional()
  healthPreferences?: string[];

  @ApiProperty({
    description: 'Dietary restrictions',
    example: 'Halal',
    required: true,
  })
  @IsString()
  dietaryRestrictions!: string;

  @ApiProperty({
    description: 'Preferred meal types',
    example: ['Breakfast', 'Dinner'],
    required: false,
    type: [String],
  })
  @IsArray()
  @IsOptional()
  mealPreference?: string[];

  @ApiProperty({
    description: 'Dining time preferences',
    example: ['Evening', 'Late Night'],
    required: false,
    type: [String],
  })
  @IsArray()
  @IsOptional()
  diningPreferences?: string[];

  @ApiProperty({
    description: 'Meal occasion preferences',
    example: ['Casual', 'Fine Dining'],
    required: false,
    type: [String],
  })
  @IsArray()
  @IsOptional()
  mealOccasionPreferences?: string[];

  @ApiProperty({
    description: 'Preferred flavors',
    example: ['Sweet', 'Spicy'],
    required: false,
    type: [String],
  })
  @IsArray()
  @IsOptional()
  preferredFlavors?: string[];

  @ApiProperty({
    description: 'Disliked flavors',
    example: ['Bitter', 'Sour'],
    required: false,
    type: [String],
  })
  @IsArray()
  @IsOptional()
  dislikedFlavors?: string[];

  @ApiProperty({
    description: 'Preferred atmosphere',
    example: ['Cozy', 'Vibrant'],
    required: false,
    type: [String],
  })
  @IsArray()
  @IsOptional()
  preferredAtmosphere?: string[];

  @ApiProperty({
    description: 'Dining companions',
    example: ['Family', 'Friends'],
    required: false,
    type: [String],
  })
  @IsArray()
  @IsOptional()
  diningCompanions?: string[];

  @ApiProperty({
    description: 'Dining frequency',
    example: 'Weekly',
    required: false,
  })
  @IsString()
  @IsOptional()
  diningFrequency?: string;

  @ApiProperty({
    description: 'Primary location',
    example: 'New York City',
    required: false,
  })
  @IsString()
  @IsOptional()
  primaryLocation?: string;

  @ApiProperty({
    description: 'Travel distance',
    example: 'Medium',
    required: false,
  })
  @IsString()
  @IsOptional()
  travelDistance?: string;

  @ApiProperty({
    description: 'Willingness to explore',
    example: 'High',
    required: false,
  })
  @IsString()
  @IsOptional()
  willingnessToExplore?: string;

  @ApiProperty({
    description: 'Rating criteria',
    example: ['Taste', 'Service'],
    required: false,
    type: [String],
  })
  @IsArray()
  @IsOptional()
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
