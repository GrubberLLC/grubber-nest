import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'User ID',
    example: 1,
    required: true,
  })
  @IsString()
  userId!: string;

  @ApiProperty({
    description: 'New followers notifications',
    example: true,
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  newFollowers?: boolean;

  @ApiProperty({
    description: 'Likes and comments notifications',
    example: true,
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  likesAndComments?: boolean;

  @ApiProperty({
    description: 'Recommendations notifications',
    example: true,
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  recommendations?: boolean;

  @ApiProperty({
    description: 'Trending spots notifications',
    example: true,
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  trendingSpots?: boolean;
}

export class UpdateNotificationDto extends CreateNotificationDto {
  @ApiProperty({
    description: 'Notification ID',
    example: 1,
    required: true,
  })
  @IsString()
  notificationId!: string;
}

export class GetNotificationDto {
  @ApiProperty({
    description: 'User ID',
    example: 1,
    required: true,
  })
  @IsString()
  userId!: string;
}

export class DeleteNotificationDto {
  @ApiProperty({
    description: 'Notification ID',
    example: 1,
    required: true,
  })
  @IsString()
  notificationId!: string;
}
