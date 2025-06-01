import { Module } from '@nestjs/common';
import { ProfileController } from '../../controllers/profile/profile.controller.js';
import { ProfileService } from '../../services/profile/profile.service.js';
import { SupabaseService } from '../../services/supabase/supabase.service.js';

@Module({
  imports: [],
  controllers: [ProfileController],
  providers: [ProfileService, SupabaseService],
  exports: [ProfileService],
})
export class ProfileModule {}
