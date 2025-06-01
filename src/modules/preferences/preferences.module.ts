import { Module } from '@nestjs/common';
import { PreferencesController } from '../../controllers/preferences/preferences.controller.js';
import { PreferencesService } from '../../services/preferences/preferences.service.js';
import { SupabaseService } from '../../services/supabase/supabase.service.js';

@Module({
  imports: [],
  controllers: [PreferencesController],
  providers: [PreferencesService, SupabaseService],
  exports: [PreferencesService],
})
export class PreferencesModule {}
