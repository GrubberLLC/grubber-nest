import { Module } from '@nestjs/common';
import { FirebaseAdminService } from '../../services/firebase-admin/firebase-admin.service.js';

@Module({
  providers: [FirebaseAdminService],
  exports: [FirebaseAdminService],
})
export class FirebaseAdminModule {}
