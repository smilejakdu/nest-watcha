import { CoreEntity } from './CoreEntity';
import { IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UsersEntity } from './UsersEntity';

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

@Entity({ schema: 'nest_watcha', name: 'orders' })
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

  @ManyToOne(() => UsersEntity,
      users => users.Boards, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  User: UsersEntity;
}