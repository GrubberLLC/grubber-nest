import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateSettingsDto {
  @ApiProperty({
    description: 'User ID',
    example: 1,
    required: true,
  })
  @IsString()
  userId!: string;

  @ApiProperty({
    description: 'Privacy level',
    example: 'Friends',
    required: false,
    default: 'Friends',
  })
  @IsString()
  @IsOptional()
  privacyLevel?: string;

  @ApiProperty({
    description: 'Primary location',
    example: 'New York City',
    required: false,
  })
  @IsString()
  @IsOptional()
  primaryLocation?: string;

  @ApiProperty({
    description: 'Primary usage',
    example: 'Personal',
    required: false,
  })
  @IsString()
  @IsOptional()
  primaryUsage?: string;

  @ApiProperty({
    description: 'Receive notifications',
    example: true,
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  receiveNotifications?: boolean;

  @ApiProperty({
    description: 'Newsletter subscription',
    example: false,
    required: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  newsletterSubscription?: boolean;
}

export class UpdateSettingsDto extends CreateSettingsDto {
  @ApiProperty({
    description: 'Settings ID',
    example: 1,
    required: true,
  })
  @IsString()
  settingsId!: string;
}

export class GetSettingsDto {
  @ApiProperty({
    description: 'User ID',
    example: 1,
    required: true,
  })
  @IsString()
  userId!: string;
}

export class DeleteSettingsDto {
  @ApiProperty({
    description: 'Settings ID',
    example: 1,
    required: true,
  })
  @IsString()
  settingsId!: string;
}
