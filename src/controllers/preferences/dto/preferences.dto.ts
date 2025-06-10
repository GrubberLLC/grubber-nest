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
  favorite_cuisines?: string[];

  @ApiProperty({
    description: 'Least favorite cuisines',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  least_favorite_cuisines?: string[];

  @ApiProperty({
    description: 'Cuisines willing to try',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  diet?: string[];

  @ApiProperty({
    description: 'Diet type',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  allergies?: string[];

  @ApiProperty({
    description: 'Food allergies',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  dietary_restrictions?: string[];

  @ApiProperty({
    description: 'Health preferences',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  meal_preference?: string[];

  @ApiProperty({
    description: 'Dietary restrictions',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  dining_time?: string[];

  @ApiProperty({
    description: 'Dietary restrictions',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  occasion?: string[];

  @ApiProperty({
    description: 'Dining time preferences',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  flavor?: string[];

  @ApiProperty({
    description: 'Meal occasion preferences',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  least_flavors?: string[];

  @ApiProperty({
    description: 'Preferred flavors',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  atmosphere?: string[];

  @ApiProperty({
    description: 'Disliked flavors',
    type: [String],
    required: false,
  })
  @IsString()
  @IsOptional()
  frequency?: string;

  @ApiProperty({
    description: 'Preferred atmosphere',
    type: [String],
    required: false,
  })
  @IsString()
  @IsOptional()
  travel_distance?: string;

  @ApiProperty({
    description: 'Willing to explore',
    type: [String],
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  explore?: boolean;

  @ApiProperty({
    description: 'Rating criteria',
    type: [String],
    required: false,
  })
  @IsString()
  @IsOptional()
  rating_criteria?: string;
}

export class UpdatePreferencesDto {
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
  @IsString()
  @IsOptional()
  preferredMealTypes?: string;

  @ApiProperty({
    description: 'Dining time preferences',
    type: [String],
    required: false,
  })
  @IsString()
  @IsOptional()
  diningTimePreferences?: string;

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
  flavorPreferences?: string[];

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
