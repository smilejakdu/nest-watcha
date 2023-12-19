import {IsNotEmptyString} from "../../../decorators/validateDecorators/is-not-empty-string.decorator";
import {IsNotEmptyNumber} from "../../../decorators/validateDecorators/is-not-empty-number.decorator";
import {ApiProperty} from "@nestjs/swagger";

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

export class CreateMultiGenreRequestDto {
  @ApiProperty({
    type: [String],
    description: '장르 이름 리스트',
    example: ['장르1', '장르2', '장르3']
  })
  public genreNameList: string[];
}