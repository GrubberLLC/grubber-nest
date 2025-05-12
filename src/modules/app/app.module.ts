import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from '../../controllers/app/app.controller.js';
import { AppService } from '../../services/app/app.service.js';
import { FirebaseAdminModule } from '../firebase-admin/firebase-admin.module.js';
import { NotificationModule } from '../notification/notification.module.js';
import { HealthModule } from '../health/health.module.js';
import { SupabaseModule } from '../supabase/supabase.module.js';
import { PlacesModule } from '../places/places.module.js';
import { UsersModule } from '../users/users.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FirebaseAdminModule,
    NotificationModule,
    HealthModule,
    SupabaseModule,
    PlacesModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
