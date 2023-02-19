import {IsNotEmptyNumber} from "../../../decorators/is-not-empty-number.decorator";

export class DeleteBoardDto {
	@IsNotEmptyNumber(1, 'id')
	public id: number;
}
