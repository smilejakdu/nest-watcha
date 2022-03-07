import { Column, Entity, OneToMany, QueryRunner } from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
// Entity
import { BoardsEntity } from './BoardsEntity';
import { CommentsEntity } from './CommentsEntity';
import { CoreEntity } from './CoreEntity';
import { OrderEntity } from './OrderEntity';
import { SchedulesEntity } from './SchedulesEntity';
import { OrderClaimEntity } from './OrderClaimEntity';

export enum LoginType {
	NAVER = 'naver',
	KAKAO = 'kakao',
	GOOGLE = 'google',
}

@Entity({ schema: 'nest_watcha', name: 'users' })
export class UsersEntity extends CoreEntity {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		example: 'ash',
		description: 'username',
	})
	@Column('varchar', { name: 'username', length: 150 })
	username: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		example: 'ash@gmail.com',
		description: 'email',
	})
	@Column('varchar', { name: 'email', length: 150 })
	email: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		example: 'password',
		description: 'password',
	})
	@Column('varchar', { name: 'password', length: 150 }) // select: false 하면 password 빼고 불러온다.
	password: string;

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

	static makeQueryBuilder(queryRunner?: QueryRunner) {
		if (queryRunner) {
			return queryRunner.manager.createQueryBuilder(UsersEntity, 'users');
		} else {
			return this.createQueryBuilder('users');
		}
	}

	static findByid(id: number, queryRunner?: QueryRunner) {
		return this.makeQueryBuilder(queryRunner)
			.where('users.id=:id ', {id})
			.andWhere('users.deletedAt is NULL');
	}

	static findByUsername(username: string, queryRunner?: QueryRunner) {
		return this.makeQueryBuilder(queryRunner)
			.where('users.username=:username ',{username})
			.andWhere('users.deletedAt is NULL');
	}


	static findAuthId(id, type, queryRunner?: QueryRunner) {
		let user_auth = this.makeQueryBuilder(queryRunner)
			.select(['users.id', 'users.status']);

		if (type == LoginType.NAVER) {
			user_auth = user_auth.where('users.naver_auth_id = :id', {id});
		} else if (type == LoginType.KAKAO) {
			user_auth = user_auth.where('users.kakao_auth_id = :id', {id});
		} else if (type == LoginType.GOOGLE) {
			user_auth = user_auth.where('users.google_auth_id = :id', {id});
		} else {
			return null;
		}

		return user_auth;
	}

	static findAuthLoginId(id, queryRunner?: QueryRunner) {
		const user_auth = this.makeQueryBuilder(queryRunner)
			.select(['users.id', 'users.status'])
			.where('users.naver_auth_id=:id OR users.kakao_auth_id=:id OR users.google_auth_id=:id', {id: id});

		return user_auth;
	}
}
