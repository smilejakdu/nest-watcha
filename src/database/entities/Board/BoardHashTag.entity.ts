import {Column, Entity, JoinColumn, ManyToOne, QueryRunner} from 'typeorm';
import { CoreEntity } from '../core.entity';
import { BoardsEntity } from './Boards.entity';
import { HashTagEntity } from '../hashTag.entity';

@Entity({ schema: 'nest_watcha', name: 'board_hashtag' })
export class BoardHashTagEntity extends CoreEntity {
	@Column('int', { name: 'board_id', nullable: true })
	board_id: number;

	@Column('int', { name: 'hash_id', nullable: true })
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

	static makeQueryBuilder(queryRunner?: QueryRunner) {
		if (queryRunner) {
			return queryRunner.manager.createQueryBuilder(BoardHashTagEntity, 'board_hashtag');
		} else {
			return this.createQueryBuilder('board_hashtag');
		}
	}
}
