import { Injectable } from '@nestjs/common';
import { getManager } from 'typeorm';
import dayjs from 'dayjs';

@Injectable()
export class SchedulesService {

  findDayjs(){
    const fromDate = dayjs(new Date()).subtract(1, 'day').format('YYYY-MM-DD 00:00:00');
    const toDate = dayjs(new Date()).subtract(1, 'day').format('YYYY-MM-DD 23:59:59');
    return {fromDate , toDate};
  }
  async findAccountMoney() {
    const {fromDate , toDate} = this.findDayjs();
    return await getManager().query(
      `
        select IFNULL(sum(o.order_price), 0) sum_price
        from orders o 
            join movies m 
                on m.id = orders.movieId
            join movie_options mo 
                on m.movieOptionId = mo.id
        where o.createdAt between  ? and ?;
    `,
      [fromDate, toDate],
    );
  }

  async findNewUser() {
    const {fromDate , toDate} = this.findDayjs();
    return await getManager().query(
      `
        select *
        from users u
        where u.createdAt between ? and ?;
      `,[fromDate,toDate]
    );
  }
}
