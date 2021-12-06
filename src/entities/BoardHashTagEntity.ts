import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CoreEntity } from './CoreEntity';
import { BoardsEntity } from './BoardsEntity';
import { HashTagEntity } from './HashTagEntity';

@Entity({ schema: 'nest_watcha', name: 'boardhashtag' })
export class BoardHashTagEntity extends CoreEntity {
	@Column('int', { name: 'boardId' })
	boardId: number;

	@Column('int', { name: 'hashId' })
	hashId: number;

	@ManyToOne(() => BoardsEntity, boards => boards.hashTag, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	@JoinColumn([{ name: 'boardId', referencedColumnName: 'id' }])
	Boards: BoardsEntity;

	@ManyToOne(() => HashTagEntity, hashTag => hashTag.boards, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	@JoinColumn([{ name: 'hashId', referencedColumnName: 'id' }])
	Hashtag: HashTagEntity;
}
