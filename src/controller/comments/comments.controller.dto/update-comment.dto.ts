import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { CreateCommentDto } from './create-comment.dto';

export class UpdateCommentDto extends PickType(CreateCommentDto, ['content'] as const) {
	@IsNumber()
	@IsNotEmpty()
	@ApiProperty({
		example: 'id',
		description: 'id',
	})
	public id: number;
}
