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
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
// Entity
import { Boards } from './Boards';
import { Comments } from './Comments';
import { Schedules } from './Schedules';
import { CoreEntity } from './CoreEntity';

@Entity({ schema: 'nest_watcha', name: 'users' })
export class Users extends CoreEntity {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		example: 'ash',
		description: 'nickname',
	})
	@Column('varchar', { name: 'nickname', length: 80 })
	nickname: string;

	@IsString()
	@IsNotEmpty()
	@Column('varchar', { name: 'password', length: 150, select: false }) // select: false 하면 password 빼고 불러온다.
	password: string;

	@OneToMany(() => Boards, boards => boards.User)
	Boards: Boards[];

	@OneToMany(() => Comments, comments => comments.User)
	Comments: Comments[];

	@OneToMany(() => Schedules, schedules => schedules.User)
	Schedules: Schedules[];
}
