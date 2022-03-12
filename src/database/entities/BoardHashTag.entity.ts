import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CoreEntity } from './core.entity';
import { BoardsEntity } from './boards.entity';
import { HashTagEntity } from './hashTag.entity';

@Entity({ schema: 'nest_watcha', name: 'board_hashtag' })
export class BoardHashTagEntity extends CoreEntity {
	@Column('int', { name: 'boardId' })
	boardId: number;

	@Column('int', { name: 'hashId' })
	hashId: number;

	@ManyToOne(() => BoardsEntity, boards => boards.boardHashTag, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	@JoinColumn({name:'boardId'})
	Boards: BoardsEntity;

	@ManyToOne(() => HashTagEntity, hashTag => hashTag.boardHashTag, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	@JoinColumn({name:'hashId'})
	Hashtag: HashTagEntity;
}
