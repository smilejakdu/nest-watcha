import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CoreEntity } from '../core.entity';
import { BoardsEntity } from './Boards.entity';

@Entity({ schema: 'nest_watcha', name: 'board_images' })
export class BoardImageEntity extends CoreEntity {
	@Column('varchar', { name: 'imagePath', length: 250 })
	imagePath: string;

	@Column('int', { name: 'board_id', nullable: true })
	board_id: number;

	@ManyToOne(
		() => BoardsEntity,
			boards => boards.boardImages, {
		onDelete: 'SET NULL',
		onUpdate: 'CASCADE',
	})
	@JoinColumn([{ name: 'board_id', referencedColumnName: 'id' }])
	board: BoardsEntity;
}
