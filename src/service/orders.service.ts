import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { OrderRepository } from '../database/repository/OrderAndPurchaseRepository/order.repository';
import { isNil } from 'lodash';
import { CoreResponse, SuccessFulResponse } from '../shared/CoreResponse';
import { CompletePaymentDto } from '../controller/order/order.controller.dto/createCompletePayment.dto';
import { Iamport } from '../controller/order/iamport';
import { IamportPaymentStatus, IamportValidateStatus } from '../database/entities/Order/order.entity';
import { UserRepository } from '../database/repository/user.repository';
import {MovieRepository} from "../database/repository/MovieAndGenreRepository/movie.repository";

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository : OrderRepository,
    private readonly usersRepository : UserRepository,
    private readonly movieRepository: MovieRepository,
  ) {}

  async createOrderNumber(email:string , set:any):Promise<CoreResponse> {
    const foundUserByEmail = await this.usersRepository.findByEmail(email).getOne();
    const createdOrder = await this.ordersRepository.createOrder(foundUserByEmail.id , set);
    if(isNil(createdOrder)){
      throw new BadRequestException('bad request create_order_number');
    }
    return SuccessFulResponse(createdOrder.raw.insertId,HttpStatus.CREATED);
  }

  async orderPaymentComplete(body: CompletePaymentDto) {
    const {impUid, imp_uid, merchant_uid,movie_id} = body;
    if (!impUid && imp_uid) {
      body.impUid = imp_uid;
      body.orderNumber = merchant_uid;
    }

    const foundMovie = await this.movieRepository.findOneBy({id: movie_id})
    if(!foundMovie) {
      throw new NotFoundException(`does not movie ${movie_id}`);
    }
    console.log('iamport imp_uid:',body.impUid, body.orderNumber);

    const iamport = new Iamport();
    const access_token = await iamport.getIamportToken();
    if(isNil(access_token)){
      throw new BadRequestException('iamport access_token error');
    }
    let paymentData;
    try{
      paymentData = await iamport.getPaymentData(imp_uid,access_token);
    }catch (error) {
      console.log(error);
      throw new BadRequestException(`결제 정보 오류 : ${error.response.data.message}`);
    }

    const {amount, status} = paymentData;
    console.log(status);
    if (foundMovie.MovieOption.price == amount) {
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

  async paymentValidate(body:any) {
    const {impUid, orderNumber} = body;
    // merchant_uid
    console.log('orderValidate', impUid, orderNumber);

    const iamport = new Iamport();
    const {access_token} = await iamport.getIamportToken();
    let paymentData;
    try {
      const getPayment = await iamport.getPaymentData(impUid,access_token);
      console.log(getPayment);
      paymentData = getPayment.data.response;
    } catch (error) {
      console.log('error:',error);
      throw new BadRequestException('payment information error: ',error.response);
    }

    const paidOrder = await this.ordersRepository.findOrderByOrderNumber(orderNumber).getOne();
    if (!paidOrder) {
      throw new BadRequestException(`not found purchase ${orderNumber}`);
    }

    const {amount, status} = paymentData;

    if (amount === paidOrder.price) {
      switch (status) {
        case IamportPaymentStatus.PAID: // 결제 완료
          return {status: IamportValidateStatus.SUCCESS, message: '결제 성공', data: paymentData};
        case IamportPaymentStatus.CANCELLED: // 취소 완료
          return {status: IamportValidateStatus.CANCELLED, message: '취소 완료', data: paymentData};
        case IamportPaymentStatus.FAILED: // 결제 실패
          return {status: IamportValidateStatus.FAILED, message: '결제 실패', data: paymentData};
      }
    }
  }

  async findOneUserOrder(userId: number):Promise<CoreResponse> {
    const foundOrderByUser = await this.ordersRepository.findUserOrders(userId).getMany();
    return SuccessFulResponse(foundOrderByUser);
  }

  async findOrderByOrderNumber(orderNumber: string) {
    const foundOrder = await this.ordersRepository.findOrderByOrderNumber(orderNumber).getOne();
    return SuccessFulResponse(foundOrder);
  }
}