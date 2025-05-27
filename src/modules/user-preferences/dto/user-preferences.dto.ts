import {
  IsArray,
  IsString,
  IsOptional,
  IsEnum,
  ArrayMinSize,
} from 'class-validator';

export class CreateUserPreferencesDto {
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  favorite_cuisines?: string[] = [];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  least_favorite_cuisines?: string[] = [];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  cuisines_willing_to_try?: string[] = [];

  @IsString()
  diet_type!: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  food_allergies!: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  health_preferences?: string[] = [];

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  dietary_restrictions!: string[];

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

export class UpdateUserPreferencesDto extends CreateUserPreferencesDto {} 