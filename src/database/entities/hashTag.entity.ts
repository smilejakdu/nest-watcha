import {Column, Entity, OneToMany, QueryRunner} from 'typeorm';
import { CoreEntity } from './core.entity';
import { BoardHashTagEntity } from './Board/BoardHashTag.entity';

@Entity({ schema: 'nest_watcha', name: 'hashtag' })
export class HashTagEntity extends CoreEntity {
	@Column('varchar', { name: 'name', length: 100 })
	name: string;

	@OneToMany(() => BoardHashTagEntity, boardHashTag => boardHashTag.hashtag)
	boardHashTag: BoardHashTagEntity[];

	static makeQueryBuilder(queryRunner?: QueryRunner) {
		if (queryRunner) {
			return queryRunner.manager.createQueryBuilder(BoardHashTagEntity, 'hashTag');
		} else {
			return this.createQueryBuilder('hashTag');
		}
	}

	static async saveHashTag(hashTag: string) {
		const newHashTag = new HashTagEntity();
		newHashTag.name = hashTag;
		return await this.save(newHashTag);
	}
}
