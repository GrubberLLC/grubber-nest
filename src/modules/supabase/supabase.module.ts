import { Module } from '@nestjs/common';
import { SupabaseService } from '../../services/supabase/supabase.service.js';

@Module({
  providers: [SupabaseService],
  exports: [SupabaseService],
})
export class SupabaseModule {}
