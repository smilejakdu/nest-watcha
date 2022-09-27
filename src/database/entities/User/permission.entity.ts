import { Column, Entity, OneToMany, QueryRunner } from 'typeorm';
import { CoreEntity } from '../core.entity';
import { UsersEntity } from './users.entity';

export enum PermissionType {
	ADMIN = 'admin',
	USER = 'user',
}

@Entity({ schema: 'nest_watcha', name: 'permissions' })
export class PermissionEntity extends CoreEntity {
	@Column({
		type: 'enum',
		enum: PermissionType,
		comment: '권한 타입',
	})
	type: PermissionType;

	@Column('int', { name: 'user_id', nullable: true })
	user_id: number | null;

	@OneToMany(() => UsersEntity, user => user.permission)
	users: UsersEntity[];

	static makeQueryBuilder(queryRunner?: QueryRunner) {
		if (queryRunner) {
			return queryRunner.manager.createQueryBuilder(PermissionEntity, 'permission');
		} else {
			return this.createQueryBuilder('permission');
		}
	}
}
