import { IsNotEmptyNumber } from "src/decorators/validateDecorators/is-not-empty-number.decorator";
import {IsNotEmptyString} from "../../../decorators/validateDecorators/is-not-empty-string.decorator";

export class CreateCommentDto {
	@IsNotEmptyString(0,1000,
		'content','content')
	public content: string;
}

export class CreateCommentWithOpenAIDto {
	@IsNotEmptyString(0,1000,
		'content','content')
	public content: string;
}

export class CreateReplyDto {
	@IsNotEmptyString(0,1000,
		'reply','reply')
	public reply: string;

	@IsNotEmptyNumber(1,'commentId')
	public comment_id: number;
}
