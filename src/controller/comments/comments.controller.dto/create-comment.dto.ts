import {IsNotEmptyString} from "../../../decorators/is-not-empty-string.decorator";
import {IsNotEmptyNumber} from "../../../decorators/is-not-empty-number.decorator";

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

