import { Column, Entity, OneToMany } from 'typeorm';
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
		example: 'ash@email.com',
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

	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		example: 'ash@kakao.com',
		description: 'kakao_auth_id',
	})
	@Column('varchar', { name: 'kakao_auth_id', length: 150 })
	kakao_auth_id: string;


	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		example: 'ash@naver.com',
		description: 'naver_auth_id',
	})
	@Column('varchar', { name: 'naver_auth_id', length: 150 })
	naver_auth_id: string;


	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		example: 'ash@gmail.com',
		description: 'google_auth_id',
	})
	@Column('varchar', { name: 'google_auth_id', length: 150 })
	google_auth_id: string;

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
}
