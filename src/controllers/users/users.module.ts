import { Module } from '@nestjs/common';
import { UsersController } from './users.controller.js';
import { UsersService } from '../../services/users/users.service.js';
import { SupabaseService } from '../../services/supabase/supabase.service.js';

@Module({
  controllers: [UsersController],
  providers: [UsersService, SupabaseService],
  exports: [UsersService],
})
export class UsersModule {}
