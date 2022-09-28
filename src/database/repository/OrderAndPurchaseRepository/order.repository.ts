import { QueryRunner, Repository, SelectQueryBuilder } from 'typeorm';
import { OrderEntity, OrderStatus } from '../../entities/Order/order.entity';
import dayjs from 'dayjs';
import {CustomRepository} from "../../../shared/typeorm-ex.decorator";

@CustomRepository(OrderEntity)
export class OrderRepository extends Repository<OrderEntity>{
  makeQueryBuilder(queryRunner?: QueryRunner): SelectQueryBuilder<OrderEntity> {
    return this.createQueryBuilder('order', queryRunner);
  }

  async createOrderNumber(): Promise<string> {
    const generateNumber = (): string => {
      return 'movieOrd' + dayjs().format('YYYYMMDD') + '-' + Math.floor(1000000 + Math.random() * 9000000);
    };
    return generateNumber();
  }

  async createOrder(userId : number,set:any) {
    const order = new OrderEntity();
    order.order_number = await this.createOrderNumber();
    order.order_status = OrderStatus.INIT;
    order.user_id = userId;

    return await this.makeQueryBuilder()
      .insert()
      .into(OrderEntity)
      .values(set)
      .execute();
  }

  findOrderByOrderNumber(orderNumber:string){
    return this.makeQueryBuilder()
      .select([
        'order:id',
        'order.order_number'
      ])
      .where('order.order_number =:orderNumber',{orderNumber:orderNumber});
  }

  findUserOrders(userId:number) {
    return this.makeQueryBuilder()
      .select([
        'order.id',
        'order.order_number',
        'order.order_status'
      ])
      .addSelect([
        'user.id',
        'user.email',
      ])
      .innerJoin('order.User','user','user.id =:userId',{userId:userId});
  }

  cancelOrder(userId:number , orderNumber:string) {
    return this.findOrderByOrderNumber(orderNumber)
      .update()
      .set({
        order_status : OrderStatus.CANCELLED,
      });
  }
}