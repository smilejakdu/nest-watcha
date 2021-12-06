import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Column, Entity, ManyToMany } from 'typeorm';
import { BoardsEntity } from './BoardsEntity';
import { CoreEntity } from './CoreEntity';

@Entity({ schema: 'nest_watcha', name: 'hashtag' })
export class HashTagEntity extends CoreEntity {
	@IsString()
	@ApiProperty({
		example: 'hash',
		description: 'hash',
	})
	@Column('varchar', { name: 'hash', length: 100 })
	hash: string;

	@ManyToMany(() => BoardsEntity, boards => boards.hashTag)
	boards: BoardsEntity[];
}
