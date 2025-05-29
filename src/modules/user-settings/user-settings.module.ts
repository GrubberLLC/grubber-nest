import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserSettingsService } from './user-settings.service.js';
import { UserSettingsController } from './user-settings.controller.js';

@Module({
  imports: [ConfigModule],
  controllers: [UserSettingsController],
  providers: [UserSettingsService],
  exports: [UserSettingsService],
})
export class UserSettingsModule {}
