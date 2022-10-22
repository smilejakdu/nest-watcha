import { Controller } from '@nestjs/common';
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiTags } from '@nestjs/swagger';
import { SchedulesService } from '../../service/schedules.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@ApiInternalServerErrorResponse({ description: '서버 에러' })
@ApiBadRequestResponse({ description: '잘못된 요청 파라미터' })
@ApiTags('SCHEDULES')
@Controller('schedules')
export class SchedulesController {
  constructor(
    private readonly schedulesService:SchedulesService
  ) { }

  @Cron(CronExpression.EVERY_9_HOURS, {
    timeZone: 'Asia/Seoul',
  })
  async handleCron() {
    const foundAccountMoney = await this.schedulesService.findAccountMoney();
    const foundNewUser = await this.schedulesService.findNewUser();

    return {
      newUser : foundNewUser,
      newAccount:foundAccountMoney,
    };
  }
}
