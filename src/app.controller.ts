import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from './decorators/public-metadata.decorator';
import { HealthCheckDTO } from './dtos/health-check.dto';

@Controller()
@ApiTags('Basic routes')
@Public()
export class AppController {
  @Get('health-check')
  @ApiResponse({ type: HealthCheckDTO })
  healthCheck(): HealthCheckDTO {
    return { message: 'I am healthy' };
  }
}
