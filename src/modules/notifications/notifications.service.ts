import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateNotificationDto,
  UpdateNotificationDto,
  NotificationType,
  NotificationStatus,
} from './dto/notifications.dto';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';

export interface Notification {
  notification_id: number;
  user_id: number;
  notification_type: NotificationType;
  notification_content: string;
  notification_link?: string;
  is_read: boolean;
  notification_status: NotificationStatus;
  notification_date: Date;
}

@Injectable()
export class NotificationsService {
  private pool: Pool;

  constructor(private configService: ConfigService) {
    this.pool = new Pool({
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      user: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_DATABASE'),
    });
  }

  async create(
    userId: number,
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    const query = `
      INSERT INTO Notifications (
        user_id, notification_type, notification_content,
        notification_link, is_read, notification_status,
        notification_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const values = [
      userId,
      createNotificationDto.notification_type,
      createNotificationDto.notification_content,
      createNotificationDto.notification_link,
      createNotificationDto.is_read,
      createNotificationDto.notification_status,
      createNotificationDto.notification_date,
    ];

    const result = await this.pool.query<Notification>(query, values);
    return result.rows[0];
  }

  async findAll(): Promise<Notification[]> {
    const query = 'SELECT * FROM Notifications ORDER BY notification_date DESC;';
    const result = await this.pool.query<Notification>(query);
    return result.rows;
  }

  async findOne(notificationId: number): Promise<Notification> {
    const query = 'SELECT * FROM Notifications WHERE notification_id = $1;';
    const result = await this.pool.query<Notification>(query, [notificationId]);

    if (!result.rows[0]) {
      throw new NotFoundException(`Notification with ID ${notificationId} not found`);
    }

    return result.rows[0];
  }

  async findByUserId(userId: number): Promise<Notification[]> {
    const query = 'SELECT * FROM Notifications WHERE user_id = $1 ORDER BY notification_date DESC;';
    const result = await this.pool.query<Notification>(query, [userId]);
    return result.rows;
  }

  async findUnreadByUserId(userId: number): Promise<Notification[]> {
    const query = 'SELECT * FROM Notifications WHERE user_id = $1 AND is_read = false ORDER BY notification_date DESC;';
    const result = await this.pool.query<Notification>(query, [userId]);
    return result.rows;
  }

  async update(
    notificationId: number,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    const query = `
      UPDATE Notifications
      SET
        notification_type = $1,
        notification_content = $2,
        notification_link = $3,
        is_read = $4,
        notification_status = $5,
        notification_date = $6
      WHERE notification_id = $7
      RETURNING *;
    `;

    const values = [
      updateNotificationDto.notification_type,
      updateNotificationDto.notification_content,
      updateNotificationDto.notification_link,
      updateNotificationDto.is_read,
      updateNotificationDto.notification_status,
      updateNotificationDto.notification_date,
      notificationId,
    ];

    const result = await this.pool.query<Notification>(query, values);

    if (!result.rows[0]) {
      throw new NotFoundException(`Notification with ID ${notificationId} not found`);
    }

    return result.rows[0];
  }

  async markAsRead(notificationId: number): Promise<Notification> {
    const query = `
      UPDATE Notifications
      SET is_read = true, notification_status = 'Read'
      WHERE notification_id = $1
      RETURNING *;
    `;

    const result = await this.pool.query<Notification>(query, [notificationId]);

    if (!result.rows[0]) {
      throw new NotFoundException(`Notification with ID ${notificationId} not found`);
    }

    return result.rows[0];
  }

  async markAllAsRead(userId: number): Promise<void> {
    const query = `
      UPDATE Notifications
      SET is_read = true, notification_status = 'Read'
      WHERE user_id = $1 AND is_read = false;
    `;

    await this.pool.query(query, [userId]);
  }

  async remove(notificationId: number): Promise<Notification> {
    const query = 'DELETE FROM Notifications WHERE notification_id = $1 RETURNING *;';
    const result = await this.pool.query<Notification>(query, [notificationId]);

    if (!result.rows[0]) {
      throw new NotFoundException(`Notification with ID ${notificationId} not found`);
    }

    return result.rows[0];
  }
} 