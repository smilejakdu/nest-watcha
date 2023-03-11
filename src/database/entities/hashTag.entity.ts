import { Column, Entity, OneToMany } from 'typeorm';
import { CoreEntity } from './core.entity';
import { BoardHashTagEntity } from './Board/BoardHashTag.entity';

@Entity({ schema: 'nest_watcha', name: 'hashtag' })
export class HashTagEntity extends CoreEntity {
	@Column('varchar', { name: 'name', length: 100 })
	name: string;

	@OneToMany(() => BoardHashTagEntity, boardHashTag => boardHashTag.hashtag)
	boardHashTag: BoardHashTagEntity[];
}
