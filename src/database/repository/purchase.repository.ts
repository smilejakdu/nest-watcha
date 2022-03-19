import { EntityRepository, QueryRunner, Repository, SelectQueryBuilder } from 'typeorm';
import { PurchaseEntity, PurchaseStatus } from '../entities/purchase.entity';
import dayjs from 'dayjs';


@EntityRepository(PurchaseEntity)
export class PurchaseRepository extends Repository<PurchaseEntity>{
  makeQueryBuilder(queryRunner?: QueryRunner): SelectQueryBuilder<PurchaseEntity> {
    return this.createQueryBuilder('purchase', queryRunner);
  }

  async createPurchaseNumber(): Promise<string> {
    const generateNumber = (): string => {
      return 'PUR' + dayjs().format('YYYYMMDD') + '-' + Math.floor(1000000 + Math.random() * 9000000);
    };
    let newPurNumber = generateNumber();
    while (true) {
      const isDuplicated = await this.makeQueryBuilder()
        .where('purchase.purchaseNumber = :number', {number: newPurNumber})
        .getMany();
      if (isDuplicated.length === 0) {
        break;
      } else {
        newPurNumber = generateNumber();
      }
    }

    return newPurNumber;
  }

  findPurchaseById(id: number, queryRunner?: QueryRunner) {
    return this.makeQueryBuilder(queryRunner).where('purchase.id = :id ', {id});
  }

  findPurchaseByIds(ids: number[], queryRunner?: QueryRunner) {
    return this.makeQueryBuilder(queryRunner)
      .where('purchase.id in (:ids) ', {ids});
  }

  findByPurchaseNumber(id: string, queryRunner?: QueryRunner) {
    return this.makeQueryBuilder(queryRunner)
      .innerJoinAndSelect('purchase.order', 'order')
      .innerJoinAndSelect('order.user', 'user')
      .where('purchase.purchaseNumber = :id', {id});
  }

  updateOne(id: number, set: any, queryRunner?: QueryRunner) {
    return this.findPurchaseById(id)
      .update(PurchaseEntity)
      .set(set);
  }

  updatePurchaseByPurchaseNumber(id: string, set: any, queryRunner?: QueryRunner) {
    return this.makeQueryBuilder(queryRunner)
      .update(PurchaseEntity)
      .set(set)
      .where('purchase.purchaseNumber = :id', {id});
  }

   deleteByIds(ids: number[], queryRunner?: QueryRunner) {
    return this.makeQueryBuilder(queryRunner)
      .softDelete()
      .from(PurchaseEntity)
      .where('purchase.id in (:ids) ', {ids})
      .andWhere('purchase.status in (:status)', {status: PurchaseStatus.DELETED});
  }
}