import { Controller } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiTags } from '@nestjs/swagger';
import { SchedulesService } from '../../service/schedules.service';

@ApiInternalServerErrorResponse({ description: '서버 에러' })
@ApiTags('SCHEDULES')
@Controller('schedules')
export class SchedulesController {
  constructor(
    private readonly schedulesService:SchedulesService
  ) {
  }

}
