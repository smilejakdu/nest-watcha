import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AgeLimitStatus } from '../../../database/entities/genre.entity';
import { Optional } from '@nestjs/common';

export class UpdateMovieDto {
  @ApiProperty({
    example:1,
    description:'genreId'
  })
  @Optional()
  genreId?: number;

  @IsString()
  @ApiProperty({
    example:'movieTitle',
    description:'movieTitle'
  })
  @Optional()
  movieTitle?: string;

  @IsNumber()
  @ApiProperty({
    example:4.5,
    description:'movieScore'
  })
  @Optional()
  movieScore?: number;

  @IsString()
  @ApiProperty({
    example: 'url_image_string',
    description:'movieImage'
  })
  @Optional()
  movieImage?:string;

  @ApiProperty({ type: [String] })
  @Optional()
  director?:string[]

  @ApiProperty({ type: [String] })
  @Optional()
  appearance?:string[]

  @ApiProperty({
    enum :AgeLimitStatus,
    isArray:true,
    example : AgeLimitStatus.ADLUT_MORE_THAN
  })
  @Optional()
  ageLimitStatus?:AgeLimitStatus;
}