import { Module } from '@nestjs/common';
import { HealthController } from '../../controllers/hello/hello.controller.js';

@Module({
  controllers: [HealthController],
})
export class HealthModule {}
