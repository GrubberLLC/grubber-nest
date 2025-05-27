import { IsString, IsBoolean, IsEnum, IsOptional, IsDate } from 'class-validator';

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
  @IsEnum(NotificationType)
  notification_type: NotificationType;

  @IsString()
  notification_content: string;

  @IsString()
  @IsOptional()
  notification_link?: string;

  @IsBoolean()
  @IsOptional()
  is_read?: boolean = false;

  @IsEnum(NotificationStatus)
  @IsOptional()
  notification_status?: NotificationStatus = NotificationStatus.UNREAD;

  @IsDate()
  @IsOptional()
  notification_date?: Date = new Date();
}

export class UpdateNotificationDto extends CreateNotificationDto {} 