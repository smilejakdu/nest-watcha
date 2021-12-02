import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Comments } from './Comments';
import { CoreEntity } from './CoreEntity';
import { Users } from './Users';
import { HashTag } from './HashTag';
import { BoardImage } from './BoardImage';

@Entity({ schema: 'nest_watcha', name: 'boards' })
export class Boards extends CoreEntity {
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

	@ManyToOne(() => Users, users => users.Boards, {
		onDelete: 'SET NULL',
		onUpdate: 'CASCADE',
	})
	@JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
	User: Users;

	@OneToMany(() => BoardImage, boardImage => boardImage.imagePath)
	Images: BoardImage[];

	@OneToMany(() => Comments, comments => comments.Board)
	Comments: Comments[];

	@ManyToMany(() => HashTag, hashTag => hashTag.boards)
	@JoinTable({
		name: 'boardhashtag',
		joinColumn: {
			name: 'boardId',
			referencedColumnName: 'id',
		},
		inverseJoinColumn: {
			name: 'hashId',
			referencedColumnName: 'id',
		},
	})
	hashTag: HashTag[];
}
