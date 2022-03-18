import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
// Entity
import { BoardsEntity } from './boards.entity';
import { CommentsEntity } from './comments.entity';
import { CoreEntity } from './core.entity';
import { OrderEntity } from './order.entity';
import { SchedulesEntity } from './schedules.entity';
import { OrderClaimEntity } from './orderClaim.entity';
import { OrderLogEntity } from './orderLog.entity';

export enum LoginType {
	NAVER = 'naver',
	KAKAO = 'kakao',
	GOOGLE = 'google',
}

@Entity({ schema: 'nest_watcha', name: 'users' })
@Unique('email', ['email'])
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
		example: '1111111111',
		description: 'phone',
	})
	@Column('varchar', { name: 'phone', length: 200 })
	phone: string;

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

	@OneToMany(() => OrderLogEntity, orderLog => orderLog.User)
	OrderLog: OrderLogEntity[];
}
