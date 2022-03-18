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
	@IsNotEmpty()
	@ApiProperty({
		example: 'hashtag',
		description: 'hashtag',
	})
	public hashtag: string;

	@ApiProperty({
		example: ['string1','string2'],
		description: 'imagePath',
	})
	public imagePath: string[];
}
