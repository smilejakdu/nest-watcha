import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { AgeLimitStatus } from '../../../database/entities/MovieAndGenre/genre.entity';
import { Type } from 'class-transformer';

export class CreateMovieDto {
  @IsNotEmpty()
  @ApiProperty({
    example:1,
    description:'genreId'
  })
  genreId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example:'movieTitle',
    description:'movieTitle'
  })
  movieTitle: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example:4.5,
    description:'movieScore'
  })
  movieScore: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'url_image_string',
    description:'movieImage'
  })
  movieImage:string;

  @IsNotEmpty()
  @IsDefined()
  @Type(() => Object)
  director:Record<string, any>;

  @IsNotEmpty()
  @IsDefined()
  @Type(() => Object)
  appearance:Record<string, any>;

  @IsNotEmpty()
  @ApiProperty({
    enum :AgeLimitStatus,
    isArray:true,
    example : AgeLimitStatus.ADLUT_MORE_THAN
  })
  ageLimitStatus:AgeLimitStatus;
}