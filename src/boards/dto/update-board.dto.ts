import { ApiProperty, PickType, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreateBoardDto } from './create-board.dto';

export class UpdateBoardDto extends PickType(CreateBoardDto, [
	'title',
	'content',
	'imagePath',
] as const) {
	@IsNumber()
	@IsNotEmpty()
	@ApiProperty({
		example: 'id',
		description: 'id',
	})
	public id: number;
}
