import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBoardDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		example: 'title',
		description: 'title',
	})
	public title: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		example: 'content',
		description: 'content',
	})
	public content: string;

	@IsString()
	@ApiProperty({
		example: 'imagePath',
		description: 'imagePath',
	})
	public imagePath: string;
}
