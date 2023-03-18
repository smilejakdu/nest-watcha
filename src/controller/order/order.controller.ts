import { Body,Req, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';
import { IamPortOrdersService } from '../../service/IamPortOrders.service';
import { UserAuthGuard } from '../../shared/auth/guard/user-auth.guard';
import { CompletePaymentDto } from './order.controller.dto/createCompletePayment.dto';
import { PermissionsGuard } from '../../shared/common/permissions/permissionCheck';
import {Request} from 'express';
import { TossPayQueryDto } from './order.controller.dto/tossPaymentsRequest.dto';
import {TossPayService} from "../../service/tossPaymentOrders.service";

@ApiInternalServerErrorResponse({
  description: '서버 에러',
})
@ApiBadRequestResponse({ description: '잘못된 요청 파라미터' })
@ApiTags('ORDERS')
@Controller('orders')
export class OrderController {
  constructor(
    private readonly iamPortOrdersService: IamPortOrdersService,
    private readonly TossPayService: TossPayService,
  ) {}

  @ApiCreatedResponse({
    description: '성공',
  })
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'order create admin' })
  @UseGuards(UserAuthGuard, PermissionsGuard)
  @Post('/admin')
  async createOrderAdmin(@Req() req: Request) {
    console.log(req.user);
  }

  @ApiBearerAuth('JWT')
  @UseGuards(UserAuthGuard)
  @Post('/payment')
  async orderComplete(@Body() body: CompletePaymentDto): Promise<any> {
    console.log(body);
    return await this.iamPortOrdersService.orderPaymentComplete(body);
  }
  /**토스 페이먼츠 api에 결제 요청하는 함수 */
  @Post('/success')
  async successPay(@Body() tossPayQueryDto: TossPayQueryDto) {
    console.log(tossPayQueryDto);
    return await this.TossPayService.orderPaymentComplete(tossPayQueryDto);
  }
}