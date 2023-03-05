import {IsNotEmptyString} from "../../../decorators/is-not-empty-string.decorator";

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
