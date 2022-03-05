import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';
import { CoreEntity } from './CoreEntity';
import { BoardHashTagEntity } from './BoardHashTagEntity';

@Entity({ schema: 'nest_watcha', name: 'hashtag' })
export class HashTagEntity extends CoreEntity {
	@IsString()
	@ApiProperty({
		example: 'hash',
		description: 'hash',
	})
	@Column('varchar', { name: 'hash', length: 100 })
	hash: string;

	@OneToMany(() => BoardHashTagEntity, BoardHashTagEntity => BoardHashTagEntity.Hashtag)
	boardHashTag: BoardHashTagEntity[];
}
