import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm';

import { BigIntTransformer } from 'src/database/transformer';
import { PurchaseEntity } from './purchase.entity';

@Entity({schema:'nest_watcha',name: 'purchase_vbank'})
export class PurchaseVbankEntity extends BaseEntity {
  @Generated()
  @PrimaryColumn({
    type: 'bigint',
    unsigned: true,
    transformer: BigIntTransformer,
  })
  id: number;

  @OneToOne(
    () => PurchaseEntity,
    purchase => purchase.id,
    {
      nullable: false,
      eager: true,
    },
  )
  @JoinColumn()
  purchase: PurchaseEntity;

  @Column({
    comment: '은행명',
  })
  vbankName: string;

  @Column({
    unique: true,
    comment: '계좌번호',
  })
  vbankNum: string;

  @Column({
    comment: '은행코드',
  })
  vbankCode: string;

  @Column({
    comment: '입금마감일',
  })
  vbankDate: Date;

  @DeleteDateColumn({
    nullable: true,
  })
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}