import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		example: 'content',
		description: 'content',
	})
	public content: string;
}
