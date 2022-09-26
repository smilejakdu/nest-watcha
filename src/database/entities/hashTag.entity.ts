import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';
import { CoreEntity } from './core.entity';
import { BoardHashTagEntity } from './Board/BoardHashTag.entity';

@Entity({ schema: 'nest_watcha', name: 'hashtag' })
export class HashTagEntity extends CoreEntity {
	@ApiProperty({
		example: 'hash',
		description: 'hash',
	})
	@Column('varchar', { name: 'hash', length: 100 })
	hash: string;

	@OneToMany(() => BoardHashTagEntity, boardHashTag => boardHashTag.hashtag)
	boardHashTag: BoardHashTagEntity[];
}
