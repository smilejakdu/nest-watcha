import { PickType } from '@nestjs/swagger';
import { CreateCommentDto } from './create-comment.dto';
import { IsNotEmptyNumber } from "../../../decorators/is-not-empty-number.decorator";
import { IsNotEmptyString } from "../../../decorators/is-not-empty-string.decorator";

export class UpdateCommentDto extends PickType(CreateCommentDto, ['content'] as const) {
	@IsNotEmptyNumber(1,'comment_id')
	comment_id: number;
}

export class UpdateReplyDto {
	@IsNotEmptyString(0,1000,
		'reply','reply')
	public reply_content: string;
}
