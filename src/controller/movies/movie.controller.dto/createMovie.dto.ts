import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { AgeLimitStatus } from '../../../database/entities/MovieAndGenre/genre.entity';
import { Type } from 'class-transformer';
import { IsNotEmptyString } from "../../../decorators/validateDecorators/is-not-empty-string.decorator";
import { IsNotEmptyNumber } from "../../../decorators/validateDecorators/is-not-empty-number.decorator";

export class CreateMovieRequestDto {
  @IsNotEmptyString(1, 100, 'movie_title', 'movie_title')
  movie_title: string;

  @IsNotEmptyString(1, 100, 'movie_description', 'movie_description')
  movie_description: string;

  @IsNotEmptyNumber(4.5, 'movie_score')
  movie_score: number;

  @IsNotEmptyString(1, 100, 'movie_image', 'movie_image')
  movie_image: string;

  @IsNotEmpty()
  @IsDefined()
  @Type(() => Object)
  @ApiProperty({
    example : "director"
  })
  director: Record<string, any>;

  @IsNotEmpty()
  @IsDefined()
  @Type(() => Object)
  @ApiProperty({
    example : "appearance"
  })
  appearance: Record<string, any>;

  @IsNotEmpty()
  @ApiProperty({
    enum : AgeLimitStatus,
    isArray: true,
    example : AgeLimitStatus.ADLUT_MORE_THAN
  })
  age_limit_status: AgeLimitStatus;
}

export class CreateMovieResponseDto {
  @IsNumber()
  @ApiProperty({
    example:1,
    description:'movieId'
  })
  movieId: number;

  @IsString()
  @ApiProperty({
    example:1,
    description:'movieName'
  })
  movieName: string;
}