import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CoreEntity } from './CoreEntity';
import { Boards } from './Boards';
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

	@Column('int', { name: 'boardId', nullable: true })
	boardId: number | null;

	@Column('int', { name: 'userId', nullable: true })
	userId: number | null;

	@ManyToOne(() => Users, users => users.Comments, {
		onDelete: 'SET NULL',
		onUpdate: 'CASCADE',
	})
	@JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
	User: Users;

	@ManyToOne(() => Boards, boards => boards.Comments, {
		onDelete: 'SET NULL',
		onUpdate: 'CASCADE',
	})
	@JoinColumn([{ name: 'boardId', referencedColumnName: 'id' }])
	Board: Boards;
}
