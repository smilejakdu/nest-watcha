import { IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CommentsEntity } from '../comments.entity';
import { CoreEntity } from '../core.entity';
import { UsersEntity } from '../User/Users.entity';
import { BoardImageEntity } from './BoardImage.entity';
import { BoardHashTagEntity } from './BoardHashTag.entity';

@Entity({ schema: 'nest_watcha', name: 'boards' })
export class BoardsEntity extends CoreEntity {
	@Column('varchar', { name: 'title', length: 100 })
	title: string;

	@Column('varchar', { name: 'content', length: 500 })
	content: string;

	@Column('int', { name: 'user_id', nullable: true })
	user_id: number | null;

	@ManyToOne(() => UsersEntity, users => users.Boards, {
		onDelete: 'SET NULL',
		onUpdate: 'CASCADE',
	})
	@JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
	User: UsersEntity;

	@OneToMany(
		() => BoardImageEntity,
			boardImage => boardImage.board
	)
	boardImages: BoardImageEntity[];

	@OneToMany(
		() => CommentsEntity,
			comments => comments.Board
	)
	comments: CommentsEntity[];

	@OneToMany(
		() => BoardHashTagEntity,
			boardHashTag => boardHashTag.boards
	)
	boardHashTag: BoardHashTagEntity[];
}
