import { Module } from '@nestjs/common';
import { AuthController } from '../../controllers/auth/auth.controller.js';
import { AuthService } from '../../services/auth/auth.service.js';

import { SupabaseModule } from '../supabase/supabase.module.js';

@Module({
  imports: [SupabaseModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {} 