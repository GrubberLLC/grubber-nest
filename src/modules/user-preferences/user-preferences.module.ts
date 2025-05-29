import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserPreferencesService } from './user-preferences.service.js';
import { UserPreferencesController } from './user-preferences.controller.js';

@Module({
  imports: [ConfigModule],
  controllers: [UserPreferencesController],
  providers: [UserPreferencesService],
  exports: [UserPreferencesService],
})
export class UserPreferencesModule {}
