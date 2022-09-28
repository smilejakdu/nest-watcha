import { EntityRepository, QueryRunner, Repository, SelectQueryBuilder } from 'typeorm';
import { OrderLogEntity } from '../../entities/Order/orderLog.entity';

@EntityRepository(OrderLogEntity)
export class OrderLogRepository extends Repository<OrderLogEntity>{
  makeQueryBuilder(queryRunner?: QueryRunner): SelectQueryBuilder<OrderLogEntity> {
    return this.createQueryBuilder('order_log', queryRunner);
  }

  findAllOrderLog(){
    return this.makeQueryBuilder()
      .where('order_log.deletedAt is null');
  }

  findOneOrderLogByUserId(userId:number) {
    return this.findAllOrderLog()
      .where('order_log.userId =:userId',{userId:userId});
  }

  findOneOrderLogByMovieId(movieId:number){
    return this.findAllOrderLog()
      .where('order_log.movieId =:movieId',{movieId:movieId});
  }

  createOrderLog(orderData:any, userId:number , movieId:number) {
    return this.makeQueryBuilder()
      .insert()
      .values({
        orderData : orderData,
        userId : userId,
        movieId:movieId,
      });
  }
}