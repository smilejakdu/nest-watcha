import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { CommentsEntity } from './CommentsEntity';
import { CoreEntity } from './CoreEntity';
import { UsersEntity } from './UsersEntity';
import { HashTagEntity } from './HashTagEntity';
import { BoardImageEntity } from './BoardImageEntity';

@Entity({ schema: 'nest_watcha', name: 'boards' })
export class BoardsEntity extends CoreEntity {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		example: 'title',
		description: 'title',
	})
	@Column('varchar', { name: 'title', length: 100 })
	title: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		example: 'content',
		description: 'content',
	})
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

	@ManyToMany(() => HashTagEntity, hashTag => hashTag.boards)
	@JoinTable({
		name: 'board_hashtag',
		joinColumn: {
			name: 'boardId',
			referencedColumnName: 'id',
		},
		inverseJoinColumn: {
			name: 'hashId',
			referencedColumnName: 'id',
		},
	})
	hashTag: HashTagEntity[];
}
