import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CoreEntity } from './core.entity';
import { BoardsEntity } from './boards.entity';
import { UsersEntity } from './users.entity';

@Entity({ schema: 'nest_watcha', name: 'comments' })
export class CommentsEntity extends CoreEntity {
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

	@ManyToOne(() => UsersEntity, users => users.Comments, {
		onDelete: 'SET NULL',
		onUpdate: 'CASCADE',
	})
	@JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
	User: UsersEntity;

	@ManyToOne(() => BoardsEntity, boards => boards.Comments, {
		onDelete: 'SET NULL',
		onUpdate: 'CASCADE',
	})
	@JoinColumn([{ name: 'boardId', referencedColumnName: 'id' }])
	Board: BoardsEntity;
}
