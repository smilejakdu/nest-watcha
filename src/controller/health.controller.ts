import { ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';

@ApiTags('HEALTH')
@Controller('health')
export class HealthController {
  @Get()
  findAll(): string {
    return 'health check';
  }
}
