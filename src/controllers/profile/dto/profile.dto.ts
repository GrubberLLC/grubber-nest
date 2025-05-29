import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsOptional,
  IsEmail,
  IsPhoneNumber,
} from 'class-validator';

export class CreateProfileDto {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsString()
  userId!: string;

  @ApiProperty({
    description: 'Username',
    example: 'johndoe',
    required: true,
  })
  @IsString()
  username!: string;

  @ApiProperty({
    description: 'Email address',
    example: 'john.doe@example.com',
    required: true,
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'First name',
    example: 'John',
    required: false,
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    description: 'Last name',
    example: 'Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    description: 'User bio',
    example: 'Food enthusiast and travel lover',
    required: false,
  })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({
    description: 'Phone number',
    example: '+1234567890',
    required: false,
  })
  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'Whether the profile is verified',
    example: false,
    required: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  verified?: boolean;

  @ApiProperty({
    description: 'Whether the profile is public',
    example: true,
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  public?: boolean;

  @ApiProperty({
    description: 'Profile picture URL',
    example: 'https://example.com/profile.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  profilePicture?: string;

  @ApiProperty({
    description: 'Firebase Cloud Messaging token',
    example: 'fcm-token-123',
    required: false,
  })
  @IsString()
  @IsOptional()
  fcmToken?: string;

  @ApiProperty({
    description: 'Account name',
    example: 'John Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  accountName?: string;

  @ApiProperty({
    description: 'Whether to show tutorial',
    example: true,
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  showTutorial?: boolean;

  @ApiProperty({
    description: 'Whether in testing mode',
    example: false,
    required: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  testing?: boolean;
}

export class UpdateProfileDto extends CreateProfileDto {
  @ApiProperty({
    description: 'Profile ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsString()
  id!: string;
}

export class GetProfileDto {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsString()
  userId!: string;
}

export class DeleteProfileDto {
  @ApiProperty({
    description: 'Profile ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsString()
  id!: string;
}
