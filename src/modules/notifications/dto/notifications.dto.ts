import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsDate,
} from 'class-validator';

export enum NotificationType {
  FOLLOW = 'Follow',
  LIKE = 'Like',
  COMMENT = 'Comment',
  REVIEW = 'Review',
  SYSTEM = 'System',
}

export enum NotificationStatus {
  UNREAD = 'Unread',
  READ = 'Read',
  ARCHIVED = 'Archived',
}

export class CreateNotificationDto {
  @ApiProperty({
    description: 'Type of notification',
    enum: NotificationType,
    example: NotificationType.LIKE,
  })
  @IsEnum(NotificationType)
  notification_type!: NotificationType;

  @ApiProperty({
    description: 'Content of the notification',
    example: 'John liked your post',
  })
  @IsString()
  notification_content!: string;

  @ApiProperty({
    description: 'Optional link associated with the notification',
    example: '/posts/123',
    required: false,
  })
  @IsString()
  @IsOptional()
  notification_link?: string;

  @ApiProperty({
    description: 'Whether the notification has been read',
    example: false,
    default: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  is_read?: boolean = false;

  @ApiProperty({
    description: 'Status of the notification',
    enum: NotificationStatus,
    example: NotificationStatus.UNREAD,
    default: NotificationStatus.UNREAD,
    required: false,
  })
  @IsEnum(NotificationStatus)
  @IsOptional()
  notification_status?: NotificationStatus = NotificationStatus.UNREAD;

  @ApiProperty({
    description: 'Date when the notification was created',
    example: new Date().toISOString(),
    default: new Date(),
    required: false,
  })
  @IsDate()
  @IsOptional()
  notification_date?: Date = new Date();
}

export class UpdateNotificationDto extends CreateNotificationDto {}
