import { IsNotEmptyNumber } from "../../../decorators/is-not-empty-number.decorator";

export class DeleteCommentDto {
	@IsNotEmptyNumber(1,'id')
	public id: number;
}

export class DeleteReplyDto {
	@IsNotEmptyNumber(1,'reply_id')
	public reply_id: number;
}
