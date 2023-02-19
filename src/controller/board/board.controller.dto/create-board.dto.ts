import { ApiProperty } from '@nestjs/swagger';
import {IsNotEmptyString} from "../../../decorators/is-not-empty-string.decorator";

export class CreateBoardDto {
	@IsNotEmptyString(1, 1000,
		'title', 'title')
	public title: string;

	@IsNotEmptyString(1, 1000,
		'content', 'content')
	public content: string;

	@IsNotEmptyString(1, 1000,
		'hashtag', 'hashtag')
	public hashtag: string;

	@ApiProperty({
		example: ['string1','string2'],
		description: 'imagePath',
	})
	public imagePath: string[];
}
