import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Column, Entity, ManyToMany } from 'typeorm';
import { Boards } from './Boards';
import { CoreEntity } from './CoreEntity';

@Entity({ schema: 'nest_watcha', name: 'hashtag' })
export class HashTag extends CoreEntity {
	@IsString()
	@ApiProperty({
		example: 'hash',
		description: 'hash',
	})
	@Column('varchar', { name: 'hash', length: 100 })
	hash: string;

	@ManyToMany(() => Boards, boards => boards.hashTag)
	boards: Boards[];
}
