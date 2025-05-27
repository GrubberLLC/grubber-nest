import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseAdminModule } from './firebase-admin/firebase-admin.module.js';
import { NotificationModule } from './notification/notification.module.js';
import { HealthModule } from './health/health.module.js';
import { SupabaseModule } from './supabase/supabase.module.js';
import { PlacesModule } from './places/places.module.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { PreferencesModule } from './preferences/preferences.module.js';
import { ProfileModule } from './profile/profile.module.js';
import { SettingsModule } from './settings/settings.module.js';

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
    AuthModule,
    PreferencesModule,
    ProfileModule,
    SettingsModule,
  ],
})
export class RootModule {}
