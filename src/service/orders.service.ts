import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OrderRepository } from '../database/repository/order.repository';
import { UsersService } from './users.service';
import { isNil } from 'lodash';
import { CoreResponse, CreateSuccessFulResponse, SuccessResponse } from '../shared/CoreResponse';
import { CompletePaymentDto } from '../controller/order/order.controller.dto/createCompletePayment.dto';
import { Iamport } from '../controller/order/iamport';
import { MoviesService } from './movies.service';
import { IamportPaymentStatus, IamportValidateStatus } from '../database/entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository : OrderRepository,
    private readonly usersService: UsersService,
    private readonly moviesService: MoviesService,
  ) {}

  async createOrderNumber(email:string , set:any):Promise<CoreResponse> {
    const foundUser = await this.usersService.findByEmail(email);
    const createdOrder = await this.ordersRepository.createOrder(foundUser.data , set);
    if(isNil(createdOrder)){
      throw new BadRequestException('bad request create_order_number');
    }
    return CreateSuccessFulResponse(createdOrder.raw.insertId);
  }

  async orderPaymentComplete(body:CompletePaymentDto) {
    const {movie_number , imp_uid }= body;
    const foundMovie = await this.moviesService.findOneById(movie_number);
    if(isNil(foundMovie)){
      throw new NotFoundException(`does not movie ${movie_number}`);
    }

    const iamport = new Iamport();
    const access_token = await iamport.getIamportToken();
    if(isNil(access_token)){
      throw new BadRequestException('iamport access_token error');
    }
    let paymentData;
    try{
      paymentData = await iamport.getPaymentData(imp_uid,access_token);
      console.log(paymentData);
    }catch (error) {
      console.log(error);
      throw new BadRequestException(`결제 정보 오류 : ${error.response.data.message}`);
    }

    const {amount, status} = paymentData;
    console.log(status);
    if (foundMovie.data.price == amount) {
      switch (status) {
        case IamportPaymentStatus.PAID: // 결제 완료
          console.log(status);
          return {status: IamportValidateStatus.SUCCESS, message: 'payment success', data: paymentData};
        case IamportPaymentStatus.CANCELLED: // 취소 완료
          console.log(status);
          return {status: IamportValidateStatus.CANCELLED, message: 'cancel success', data: paymentData};
        case IamportPaymentStatus.FAILED: // 결제 실패
          console.log(status);
          return {status: IamportValidateStatus.FAILED, message: 'payment fail', data: paymentData};
      }
    }
  }

  async findOneOrder(email:string):Promise<CoreResponse> {
    const foundUser = await this.usersService.findByEmail(email);
    const foundOrderByUser = await this.ordersRepository.findUserOrders(foundUser.data).getMany();
    return SuccessResponse(foundOrderByUser);
  }

  async findOrderByOrderNumber(orderNumber:string) {
    return this.ordersRepository.findOrderByOrderNumber(orderNumber)
      .getOne();
  }
}