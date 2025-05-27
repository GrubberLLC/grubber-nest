import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module.js';
import { NotificationModule } from './modules/notification/notification.module.js';
import { PreferencesModule } from './modules/preferences/preferences.module.js';
import { ProfileModule } from './modules/profile/profile.module.js';
import { SettingsModule } from './modules/settings/settings.module.js';
import { SupabaseService } from './services/supabase/supabase.service.js';
import { HealthModule } from './modules/health/health.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    NotificationModule,
    PreferencesModule,
    ProfileModule,
    SettingsModule,
    HealthModule,
  ],
  providers: [SupabaseService],
})
export class AppModule {} 