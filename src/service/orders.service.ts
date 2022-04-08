import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { OrderRepository } from '../database/repository/order.repository';
import { UsersService } from './users.service';
import { isNil } from 'lodash';
import { CoreResponse } from '../shared/CoreResponse';
import { CompletePaymentDto } from '../controller/order/order.controller.dto/createCompletePayment.dto';
import { Iamport } from '../controller/order/iamport';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository : OrderRepository,
    private readonly usersService: UsersService
  ) {}

  async createOrderNumber(email:string , set:any):Promise<CoreResponse> {
    const foundUser = await this.usersService.findByEmail(email);
    const createdOrder = await this.ordersRepository.createOrder(foundUser.data , set);
    if(isNil(createdOrder)){
      throw new BadRequestException('bad request create_order_number');
    }
    return {
      ok: true,
      statusCode : HttpStatus.CREATED ,
      message: 'CREATED',
      data:createdOrder.raw.insertId,
    };
  }

  async orderPaymentComplete(body:CompletePaymentDto) {
    const {movie_number , imp_uid }= body;
    console.log(movie_number);
    console.log(imp_uid);

    const iamport = new Iamport();
    const access_token = await iamport.getIamportToken();
    if(isNil(access_token)){
      throw new BadRequestException('iamport access_token error');
    }

    try{
      const result = await iamport.getPaymentData(imp_uid,access_token);
      console.log(result);
      return result;
    }catch (error) {
      console.log(error);
      throw new BadRequestException(`결제 정보 오류 : ${error.response.data.message}`);
    }
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