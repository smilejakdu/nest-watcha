import { Column, Entity, JoinColumn, ManyToOne, OneToMany, QueryRunner } from 'typeorm';
// Entity
import { BoardsEntity } from '../Board/Boards.entity';
import { CommentsEntity } from '../comments/comments.entity';
import { CoreEntity } from '../core.entity';
import { OrderEntity } from '../Order/order.entity';
import { SchedulesEntity } from '../schedules.entity';
import { OrderClaimEntity } from '../Order/orderClaim.entity';
import { OrderLogEntity } from '../Order/orderLog.entity';
import { PermissionEntity } from './Permission.entity';

export enum LoginType {
	NAVER = 'naver',
	KAKAO = 'kakao',
	GOOGLE = 'google',
}

@Entity({ schema: 'nest_watcha', name: 'users' })
export class UsersEntity extends CoreEntity {
	@Column('varchar', { name: 'username', length: 150 })
	username: string;

	@Column('varchar', { name: 'email', length: 150 })
	email: string;

	@Column('varchar', { name: 'phone', length: 200, nullable: true })
	phone: string;

	@Column('varchar', { name: 'password', length: 150, nullable: true }) // select: false 하면 password 빼고 불러온다.
	password: string;

	@Column('varchar', { name: 'kakao_auth_id', length: 150, nullable: true })
	kakao_auth_id: string;

	@Column('varchar', { name: 'naver_auth_id', length: 150, nullable: true })
	naver_auth_id: string;

	@Column('varchar', { name: 'google_auth_id', length: 150, nullable: true })
	google_auth_id: string;

	@Column('int', { name: 'permission_id', nullable: true })
	permission_id: number | null;

	@ManyToOne(() => PermissionEntity, permission => permission.users, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	@JoinColumn({ name: 'permission_id' })
	permission: PermissionEntity;

	@OneToMany(() => BoardsEntity, boards => boards.User)
	Boards: BoardsEntity[];

	@OneToMany(() => CommentsEntity, comments => comments.User)
	Comments: CommentsEntity[];

	@OneToMany(() => SchedulesEntity, schedules => schedules.User)
	Schedules: SchedulesEntity[];

	@OneToMany(() => OrderEntity, order => order.User)
	Orders: OrderEntity[];

	@OneToMany(() => OrderClaimEntity, orderClaim => orderClaim.User)
	OrderClaims: OrderClaimEntity[];

	@OneToMany(() => OrderLogEntity, orderLog => orderLog.User)
	OrderLog: OrderLogEntity[];

	static makeQueryBuilder(queryRunner?: QueryRunner) {
		if (queryRunner) {
			return queryRunner.manager.createQueryBuilder(UsersEntity, 'users');
		} else {
			return this.createQueryBuilder('users');
		}
	}
}
