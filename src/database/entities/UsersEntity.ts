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
}
