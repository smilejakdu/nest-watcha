import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {IsOptionalStringMaxLength} from "../../../decorators/validateDecorators/is-optional-string.decorator";

export class GetMovieDto{
  @IsNotEmpty()
  @ApiProperty({
    example:1,
    description:'movieId',
  })
  movieId:number;
}

enum OrderBy {
  ASC = 'ASC',
  DESC = 'DESC',
  KOREAN = 'KOREAN',
}

export class GetMovieListDto {
  @IsOptionalStringMaxLength(
    100,
    'movie_keyword', 'movie_keyword', )
  movie_keyword?: string;

  @IsOptionalStringMaxLength(
    100,
    "{'감독':'안승현','작가':'정소담'}",
    'movie_description',
  )
  director?: string;

  @IsOptionalStringMaxLength(
    100,
    "{'액션':'아자아자','기기':'디기디기'}",
    'movie_description',
  )
  appearance?: string;

  @IsOptionalStringMaxLength(
      100,
    OrderBy.DESC,
      'order_by',
  )
  order_by?: string;
}