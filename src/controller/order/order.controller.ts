import { Controller, Post, Request } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';
import { OrdersService } from '../../service/orders.service';

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
  @Post('/admin')
  async createOrderAdmin(@Request() req: any) {
    console.log(req.user);
  }
}