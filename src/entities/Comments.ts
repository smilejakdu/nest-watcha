import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Boards } from './Boards';
import { CoreEntity } from './CoreEntity';
import { Users } from './Users';

@Entity({ schema: 'nest_watcha', name: 'comments' })
export class Comments extends CoreEntity {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		example: 'content',
		description: 'content',
	})
	@Column('varchar', { name: 'content', length: 500 })
	content: string;

	@Column('int', { name: 'BoardId', nullable: true })
	BoardId: number | null;

	@Column('int', { name: 'UserId', nullable: true })
	UserId: number | null;

	@ManyToOne(() => Users, users => users.UserToComments, {
		onDelete: 'SET NULL',
		onUpdate: 'CASCADE',
	})
	@JoinColumn([{ name: 'UserId', referencedColumnName: 'id' }])
	User: Users;

	@ManyToOne(() => Boards, boards => boards.Comments, {
		onDelete: 'SET NULL',
		onUpdate: 'CASCADE',
	})
	@JoinColumn([{ name: 'BoardId', referencedColumnName: 'id' }])
	Board: Boards;
}
