import { CoreEntity } from './core.entity';
import { IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { UsersEntity } from './users.entity';
import { MovieEntity } from './movie.entity';

export enum OrderStatus {
  INIT = 'init',
  READY_VBANK = 'ready_vbank',
  ORDER_FULFILLED = 'order_fulfilled',
  PAID = 'paid',
  UNMATCHED = 'unmatched',
  CANCELLED = 'cancelled',
  PURCHASE_DECISION = 'purchase_decision',
  DELETED = 'deleted',
  RETURNED = 'returned',
  EXCHANGED = 'exchanged'
}

export enum IamportPaymentStatus {
  PAID = 'paid', // 결제 완료
  CANCELLED = 'cancelled', // 취소됨
  FAILED = 'failed', // 결제 실패
}

export enum IamportValidateStatus {
  SUCCESS = 'success', // 결제 성공
  VBANKISSUED = 'vbankIssued', // 가상계좌 발급 성공
  CANCELLED = 'cancelled', // 취소됨
  FAILED = 'failed', // 결제 실패
}


@Entity({ schema: 'nest_watcha', name: 'orders' })
@Index(['order_number'])
export class OrderEntity extends CoreEntity{
  @IsString()
  @IsNotEmpty()
  @Column('varchar',{name:'order_number',length:250})
  order_number:string;

  @Column({
    type:'enum',
    enum : OrderStatus,
    default : OrderStatus.INIT,
    nullable: false,
    comment: '주문 상태',
  })
  order_status:OrderStatus;

  @Column('int', { name: 'userId', nullable: true })
  userId: number|null;

  @Column('int', { name: 'movieId', nullable: true })
  movieId: number|null;

  @ManyToOne(() => UsersEntity,
      users => users.Boards, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  User: UsersEntity;

  @OneToOne(()=>MovieEntity,
    movieEntity => movieEntity.id,
    )
  @JoinColumn([{ name: 'movieId', referencedColumnName: 'id' }])
  Movie: MovieEntity;
}