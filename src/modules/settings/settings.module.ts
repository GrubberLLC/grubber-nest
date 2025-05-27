import { Module } from '@nestjs/common';
import { SettingsController } from '../../controllers/settings/settings.controller.js';
import { SettingsService } from '../../services/settings/settings.service.js';
import { SupabaseService } from '../../services/supabase/supabase.service.js';

@Module({
  imports: [],
  controllers: [SettingsController],
  providers: [SettingsService, SupabaseService],
  exports: [SettingsService],
})
export class SettingsModule {} 