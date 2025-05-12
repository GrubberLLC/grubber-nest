import { Module } from '@nestjs/common';
import { NotificationController } from '../../controllers/notification/notification.controller.js';
import { NotificationService } from '../../services/notification/notification.service.js';
import { FirebaseAdminModule } from '../firebase-admin/firebase-admin.module.js';

@Module({
  imports: [FirebaseAdminModule],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
