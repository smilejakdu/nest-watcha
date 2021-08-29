import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	Index,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Boards } from './Boards';
import { Comments } from './Comments';
import { Schedules } from './Schedules';

@Index('nickname', ['nickname'], { unique: true })
@Entity({ schema: 'nest_watcha', name: 'users' })
export class Users {
	@PrimaryGeneratedColumn({ type: 'int', name: 'id' })
	id: number;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		example: 'ash',
		description: 'nickname',
	})
	@Column('varchar', { name: 'nickname', length: 40 })
	nickname: string;

	@IsString()
	@IsNotEmpty()
	@Column('varchar', { name: 'password', length: 100, select: false }) // select: false 하면 password 빼고 불러온다.
	password: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@DeleteDateColumn()
	deletedAt: Date | null;

	@OneToMany(() => Boards, boards => boards.User)
	UserToBoards: Boards[];

	@OneToMany(() => Comments, comments => comments.User)
	UserToComments: Comments[];

	@OneToMany(() => Schedules, schedules => schedules.User)
	UserToSchedules: Schedules[];
}
