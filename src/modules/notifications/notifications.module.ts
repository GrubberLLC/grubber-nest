import { Module } from '@nestjs/common';
import { NotificationsService } from '../../services/notifications/notifications.service.js';
import { NotificationsController } from './notifications.controller.js';
import { SupabaseService } from '../../services/supabase/supabase.service.js';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, SupabaseService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
