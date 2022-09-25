import { Column, Entity, JoinColumn, ManyToOne, QueryRunner } from 'typeorm';
import { CoreEntity } from './core.entity';
import { UsersEntity } from './User/users.entity';

export enum PermissionType {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('permissions')
export class PermissionsEntity extends CoreEntity {
  @Column({
    type: 'enum',
    enum: PermissionType,
    comment: '권한 타입',
  })
  type: PermissionType;

  @Column('int', { name: 'user_id', nullable: true })
  user_id: number | null;

  @ManyToOne(() => UsersEntity, (users) => users.permission, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  users: UsersEntity;

  static makeQueryBuilder(queryRunner?: QueryRunner) {
    if (queryRunner) {
      return queryRunner.manager.createQueryBuilder(PermissionsEntity, 'permissions');
    } else {
      return this.createQueryBuilder('permissions');
    }
  }
}
