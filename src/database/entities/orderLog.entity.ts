import { CoreEntity } from './core.entity';
import { Column, JoinColumn, ManyToOne } from 'typeorm';
import { JsonTransformer } from '../transformer';
import { UsersEntity } from './users.entity';

export class OrderLogEntity extends CoreEntity {
  @Column({
    type: 'text',
    transformer: JsonTransformer,
    nullable: true,
  })
  orderData: Record<string, any>;

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