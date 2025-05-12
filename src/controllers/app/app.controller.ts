import { Controller } from '@nestjs/common';
import { AppService } from '../../services/app/app.service.js';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Root route has been removed, we now use /health for health checks
}
