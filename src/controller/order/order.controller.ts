import { Controller, Post, Request, UseGuards } from '@nestjs/common';
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
import { checkAdminPermission, PermissionType } from '../../shared/common/permissions/permissionCheck';

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
  @UseGuards(UserAuthGuard)
  @ApiOperation({ summary: 'order create admin' })
  @Post('/admin')
  async createOrderAdmin(@Request() req: any) {
    checkAdminPermission(req, [{permissionType: PermissionType.ADMIN}]);
    console.log(req.user);
  }
}