import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CoreEntity } from './CoreEntity';
import { Boards } from './Boards';
import { HashTag } from './HashTag';

@Entity({ schema: 'nest_watcha', name: 'boardhashtag' })
export class BoardHashTag extends CoreEntity {
	@Column('int', { name: 'boardId' })
	boardId: number;

	@Column('int', { name: 'hashId' })
	hashId: number;

	@ManyToOne(() => Boards, boards => boards.hashTag, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	@JoinColumn([{ name: 'boardId', referencedColumnName: 'id' }])
	Boards: Boards;

	@ManyToOne(() => HashTag, hashTag => hashTag.boards, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	@JoinColumn([{ name: 'hashId', referencedColumnName: 'id' }])
	Hashtag: HashTag;
}
