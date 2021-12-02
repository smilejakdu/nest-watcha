import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CoreEntity } from './CoreEntity';
import { Boards } from './Boards';

@Entity({ schema: 'nest_watcha', name: 'images' })
export class BoardImage extends CoreEntity {
	@IsString()
	@ApiProperty({
		example: 'imagePath',
		description: 'imagePath',
	})
	@Column('varchar', { name: 'imagePath', length: 250 })
	imagePath: string;

	@Column('int', { name: 'boardId', nullable: true })
	boardId: number;

	@ManyToOne(() => Boards, boards => boards.Images, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	@JoinColumn([{ name: 'boardId', referencedColumnName: 'id' }])
	Board: Boards;
}
