import { QueryRunner, Repository, SelectQueryBuilder } from 'typeorm';
import { OrderEntity, OrderStatus } from '../../entities/Order/order.entity';
import { CustomRepository } from "../../../shared/typeorm/typeorm-ex.decorator";

@CustomRepository(OrderEntity)
export class OrderRepository extends Repository<OrderEntity>{
  makeQueryBuilder(queryRunner?: QueryRunner): SelectQueryBuilder<OrderEntity> {
    return this.createQueryBuilder('order', queryRunner);
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