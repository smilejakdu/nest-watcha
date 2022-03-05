import { IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CommentsEntity } from './CommentsEntity';
import { CoreEntity } from './CoreEntity';
import { UsersEntity } from './UsersEntity';
import { BoardImageEntity } from './BoardImageEntity';
import { BoardHashTagEntity } from './BoardHashTagEntity';

@Entity({ schema: 'nest_watcha', name: 'boards' })
export class BoardsEntity extends CoreEntity {
	@IsString()
	@IsNotEmpty()
	@Column('varchar', { name: 'title', length: 100 })
	title: string;

	@IsString()
	@IsNotEmpty()
	@Column('varchar', { name: 'content', length: 500 })
	content: string;

	@Column('int', { name: 'userId', nullable: true })
	userId: number | null;

	@ManyToOne(() => UsersEntity, users => users.Boards, {
		onDelete: 'SET NULL',
		onUpdate: 'CASCADE',
	})
	@JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
	User: UsersEntity;

	@OneToMany(() => BoardImageEntity, boardImage => boardImage.imagePath)
	Images: BoardImageEntity[];

	@OneToMany(() => CommentsEntity, comments => comments.Board)
	Comments: CommentsEntity[];

	@OneToMany(() => BoardHashTagEntity, boardHashTagEntity => boardHashTagEntity.Boards)
	boardHashTag: BoardHashTagEntity[];
}
