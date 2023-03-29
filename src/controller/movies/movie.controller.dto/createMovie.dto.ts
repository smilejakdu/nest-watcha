import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { AgeLimitStatus } from '../../../database/entities/MovieAndGenre/genre.entity';
import { Type } from 'class-transformer';

export class CreateMovieRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'movie_title',
    description: 'movie_title'
  })
  movie_title: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 4.5,
    description: 'movie_score'
  })
  movie_score: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'movie_image',
    description: 'movie_image'
  })
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