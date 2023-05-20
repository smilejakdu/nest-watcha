import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { OrderEntity } from "../database/entities/Order/order.entity";
import { UsersEntity } from "../database/entities/User/Users.entity";

@Injectable()
export class SchedulesService {
  findDayjs() {
    const fromDate = dayjs(new Date()).subtract(1, 'day').format('YYYY-MM-DD 00:00:00');
    const toDate = dayjs(new Date()).subtract(1, 'day').format('YYYY-MM-DD 23:59:59');
    return {fromDate , toDate};
  }

  async findAccountMoney() {
    const {fromDate , toDate} = this.findDayjs();
    return OrderEntity.makeQueryBuilder()
      .select('IFNULL(SUM(orders.order_price),0) as sum_price')
      .innerJoin('orders.Movie', 'movie')
      .where('orders.createdAt between :forDate and :toDate', {forDate: fromDate, toDate: toDate})
  }
  async findNewUser() {
    const {fromDate , toDate} = this.findDayjs();
    return UsersEntity.makeQueryBuilder()
      .where('createdAt between :forDate and :toDate', {forDate: fromDate, toDate: toDate})
  }
}
