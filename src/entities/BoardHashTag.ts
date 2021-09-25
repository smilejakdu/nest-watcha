import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CoreEntity } from './CoreEntity';
import { Boards } from './Boards';
import { HashTag } from './HashTag';

@Entity({ schema: 'nest_watcha', name: 'boardhashtag' })
export class BoardHashTag extends CoreEntity {
	@Column('int', { name: 'BoardId' })
	BoardId: number;

	@Column('int', { name: 'HashId' })
	HashId: number;

	@ManyToOne(() => Boards, boards => boards.hashTag, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	@JoinColumn([{ name: 'BoardId', referencedColumnName: 'id' }])
	Boards: Boards;

	@ManyToOne(() => HashTag, hashTag => hashTag.boards, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	@JoinColumn([{ name: 'HashId', referencedColumnName: 'id' }])
	Hashtag: HashTag;
}
