import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteCommentDto {
	@IsNumber()
	@IsNotEmpty()
	@ApiProperty({
		example: 'id',
		description: 'id',
	})
	public id: number;
}
