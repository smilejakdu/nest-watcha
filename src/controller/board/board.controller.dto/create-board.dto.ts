import {ApiPropertyOptional} from '@nestjs/swagger';
import {IsNotEmptyString} from "../../../decorators/validateDecorators/is-not-empty-string.decorator";
import {IsOptional} from "class-validator";

export class CreateBoardDto {
	private _title: string;
	private _content: string;
	private _boardHashTag?: string[];
	private _boardImages?: string[];

	@IsNotEmptyString(1, 1000,
		'title', 'title')
	title: string;

	@IsNotEmptyString(1, 1000,
		'content', 'content')
	content: string;

	@ApiPropertyOptional({
		example: ['결제','페이'],
		description: 'boardHashTag',
	})
	@IsOptional()
	boardHashTag?: string[];

	@ApiPropertyOptional({
		example: ['string1','string2'],
		description: 'boardImages',
	})
	@IsOptional()
	boardImages?: string[];
}
