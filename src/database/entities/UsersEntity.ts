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

@Entity({ schema: 'nest_watcha', name: 'users' })
export class UsersEntity extends CoreEntity {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		example: 'ash',
		description: 'nickname',
	})
	@Column('varchar', { name: 'nickname', length: 150 })
	nickname: string;

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

	static findByNickname(nickname: string, queryRunner?: QueryRunner) {
		return this.makeQueryBuilder(queryRunner)
			.where('users.nickname=:nickname ',{nickname})
			.andWhere('users.deletedAt is NULL');
	}
}
