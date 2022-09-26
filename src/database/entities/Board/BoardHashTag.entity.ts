import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CoreEntity } from '../core.entity';
import { BoardsEntity } from './boards.entity';
import { HashTagEntity } from '../hashTag.entity';

@Entity({ schema: 'nest_watcha', name: 'board_hashtag' })
export class BoardHashTagEntity extends CoreEntity {
	@Column('int', { name: 'board_id' })
	board_id: number;

	@Column('int', { name: 'hash_id' })
	hash_id: number;

	@ManyToOne(() => BoardsEntity, boards => boards.boardHashTag, {
		onDelete: 'SET NULL',
		onUpdate: 'CASCADE',
	})
	@JoinColumn({name:'board_id'})
	boards: BoardsEntity;

	@ManyToOne(() => HashTagEntity, hashTag => hashTag.boardHashTag, {
		onDelete: 'SET NULL',
		onUpdate: 'CASCADE',
	})
	@JoinColumn({name:'hash_id'})
	hashtag: HashTagEntity;
}
