import {IsNotEmptyString} from "../../../decorators/validateDecorators/is-not-empty-string.decorator";
import {IsNotEmptyNumber} from "../../../decorators/validateDecorators/is-not-empty-number.decorator";

export class CreateGenreRequestDto {
  @IsNotEmptyString(0,1000,
    'genreName','genreName')
  public genreName: string;
}

export class CreateGenreResponseDto {
  @IsNotEmptyNumber(1,'id')
  id: number;

  @IsNotEmptyString(0,150,
    'name','name')
  genreName: string;
}