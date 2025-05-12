import { Module } from '@nestjs/common';
import { UsersController } from '../../controllers/users/users.controller.js';
import { UsersService } from '../../services/users/users.service.js';
import { SupabaseModule } from '../supabase/supabase.module.js';

@Module({
  imports: [SupabaseModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
