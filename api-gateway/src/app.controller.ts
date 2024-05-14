import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Healthcheck')
@Controller('v1/health-check')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOkResponse({ description: 'App status' })
  @Get()
  healthCheck() {
    return this.appService.healthCheck();
  }
}
