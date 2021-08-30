import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBoardDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		example: 'title',
		description: 'title',
	})
	public readonly title: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		example: 'content',
		description: 'content',
	})
	public readonly content: string;

	@IsString()
	@ApiProperty({
		example: 'imagePath',
		description: 'imagePath',
	})
	public readonly imagePath: string;
}
