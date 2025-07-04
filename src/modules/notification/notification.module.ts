import { Module } from '@nestjs/common';
import { NotificationsController } from '../../controllers/notifications/notifications.controller.js';
import { NotificationsService } from '../../services/notifications/notifications.service.js';
import { SupabaseService } from '../../services/supabase/supabase.service.js';

@Module({
  imports: [],
  controllers: [NotificationsController],
  providers: [NotificationsService, SupabaseService],
  exports: [NotificationsService],
})
export class NotificationModule {}
