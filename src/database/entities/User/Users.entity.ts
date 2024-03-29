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
import {MovieReviewEntitiy} from "../movieReview/movieReview.entitiy";

export enum LoginType {
	NAVER = 'naver',
	KAKAO = 'kakao',
	GOOGLE = 'google',
}

export interface IKakaoUserData {
	id: number;
	connected_at: string;
	properties: {
		nickname: string;
		profile_image: string;
		thumbnail_image: string;
	};
	kakao_account: {
		profile_needs_agreement: boolean;
		profile: any; // 객체 타입이 정해져 있지 않으므로 any로 처리합니다.
		has_email: boolean;
		email_needs_agreement: boolean;
		is_email_valid: boolean;
		is_email_verified: boolean;
		email: string;
	};
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
		onDelete: 'SET NULL',
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

	@OneToMany(() => MovieReviewEntitiy, movieReview => movieReview.user)
	movieReviews: MovieReviewEntitiy[];

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
