import { HttpStatus, Injectable } from '@nestjs/common';
import { OrderLogRepository } from '../database/repository/orderLog.repository';
import { isNil } from 'lodash';

@Injectable()
export class OrderLogService{
  constructor(
    private readonly orderLogRepository:OrderLogRepository,
  ) {}

  async createOrderLog(orderData:any, userId:number , movieId:number) {
    const createdOrderLog = await this.orderLogRepository
      .createOrderLog(orderData , userId , movieId).execute();
    return {
      ok: !isNil(createdOrderLog),
      statusCode :!isNil(createdOrderLog) ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST,
      message: !isNil(createdOrderLog) ?'SUCCESS': 'BAD_REQUEST',
      data:!isNil(createdOrderLog) ? createdOrderLog : null,
    };
  }

  async findAllOrderLog() {
   const foundAllOrderLog = await this.orderLogRepository.findAllOrderLog().getMany();
   return {
     ok: !isNil(foundAllOrderLog),
     statusCode :!isNil(foundAllOrderLog) ? HttpStatus.OK : HttpStatus.NOT_FOUND,
     message: !isNil(foundAllOrderLog) ?'SUCCESS': 'BAD_REQUEST',
     data:!isNil(foundAllOrderLog) ? foundAllOrderLog : null,
   };
  }

  async findManyOrderLogByUserId(userId:number) {
    const foundManyOrderLog = await this.orderLogRepository.findOneOrderLogByUserId(userId).getMany();
    return {
      ok: !isNil(foundManyOrderLog),
      statusCode :!isNil(foundManyOrderLog) ? HttpStatus.OK : HttpStatus.NOT_FOUND,
      message: !isNil(foundManyOrderLog) ?'SUCCESS': 'BAD_REQUEST',
      data:!isNil(foundManyOrderLog) ? foundManyOrderLog : null,
    };
  }

  async findOneOrderLogByMovieId(movieId:number) {
    const foundManyOrderLog = await this.orderLogRepository.findOneOrderLogByMovieId(movieId).getMany();
    return {
      ok: !isNil(foundManyOrderLog),
      statusCode :!isNil(foundManyOrderLog) ? HttpStatus.OK : HttpStatus.NOT_FOUND,
      message: !isNil(foundManyOrderLog) ?'SUCCESS': 'BAD_REQUEST',
      data:!isNil(foundManyOrderLog) ? foundManyOrderLog : null,
    };
  }
}