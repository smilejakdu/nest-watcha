import { HttpStatus, Injectable } from '@nestjs/common';
import { OrderRepository } from '../database/repository/order.repository';
import { UsersService } from './users.service';
import { isNil } from 'lodash';
import { CoreResponse } from '../shared/CoreResponse';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository : OrderRepository,
    private readonly usersService: UsersService
  ) {}

  async createOrderNumber(email:string , set:any):Promise<CoreResponse> {
    const foundUser = await this.usersService.findByEmail(email);
    const createdOrder = await this.ordersRepository.createOrder(foundUser.data , set);
    return {
      ok: !isNil(createdOrder),
      statusCode :!isNil(createdOrder) ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST,
      message: !isNil(createdOrder) ?'SUCCESS': 'BAD_REQUEST',
      data:!isNil(createdOrder) ? createdOrder.raw.insertId : null,
    };
  }

  async findOneOrder(email:string):Promise<CoreResponse> {
    const foundUser = await this.usersService.findByEmail(email);
    const foundOrderByUser = await this.ordersRepository.findUserOrders(foundUser.data).getMany();
    return {
      ok: true,
      statusCode : HttpStatus.OK,
      message: 'SUCCESS',
      data: foundOrderByUser,
    };
  }

  async findOrderByOrderNumber(orderNumber:string) {
    return this.ordersRepository.findOrderByOrderNumber(orderNumber)
      .getOne();

  }
}