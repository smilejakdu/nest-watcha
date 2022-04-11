import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';
import { OrdersService } from '../../service/orders.service';
import { UserAuthGuard } from '../../shared/auth/guard/user-auth.guard';
import { CompletePaymentDto } from './order.controller.dto/createCompletePayment.dto';
import { PermissionsGuard } from '../../shared/common/permissions/permissionCheck';

@ApiInternalServerErrorResponse({
  description: '서버 에러',
})
@ApiBadRequestResponse({ description: '잘못된 요청 파라미터' })
@ApiTags('ORDERS')
@Controller('orders')
export class OrderController {
  constructor(
    private readonly ordersService : OrdersService,
  ) {}

  @ApiCreatedResponse({
    description: '성공',
  })
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'order create admin' })
  @UseGuards(UserAuthGuard,PermissionsGuard)
  @Post('/admin')
  async createOrderAdmin(@Request() req: any) {
    console.log(req.user);
  }

  @ApiBearerAuth('JWT')
  @UseGuards(UserAuthGuard)
  @Post('/payment')
  async orderComplete(@Body() body: CompletePaymentDto): Promise<any> {
    console.log(body);
    return await this.ordersService.orderPaymentComplete(body);
  }
}