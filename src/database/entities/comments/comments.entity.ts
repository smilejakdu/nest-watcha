import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

import { CoreEntity } from '../core.entity';
import { BoardsEntity } from '../Board/Boards.entity';
import { UsersEntity } from '../User/Users.entity';
import { ReplyEntitiy } from "./reply.entitiy";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ schema: 'nest_watcha', name: 'comments' })
export class CommentsEntity extends CoreEntity {
	@Column('varchar', { name: 'content', length: 500 })
	content: string;

	@Column('int', { name: 'boardId', nullable: true })
	boardId: number | null;

	@Column('int', { name: 'userId', nullable: true })
	userId: number | null;

	@ApiProperty()
	@Column('decimal', { precision: 5, scale: 2, comment: '별점 (소수점 2째자리)' })
	like_counts: number;

	@ManyToOne(() => UsersEntity, users => users.Comments, {
		onDelete: 'SET NULL',
		onUpdate: 'CASCADE',
	})
	@JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
	User: UsersEntity;

	@ManyToOne(() => BoardsEntity, boards => boards.comments, {
		onDelete: 'SET NULL',
		onUpdate: 'CASCADE',
	})
	@JoinColumn([{ name: 'boardId', referencedColumnName: 'id' }])
	Board: BoardsEntity;

	@OneToMany(() => ReplyEntitiy, reply => reply.comments)
	Reply: ReplyEntitiy[];
}
