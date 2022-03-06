import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { AgeLimitStatus } from '../../../database/entities/GenreEntity';

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
  @ApiProperty({ type: [String] })
  director:string[]

  @IsNotEmpty()
  @ApiProperty({ type: [String] })
  appearance:string[]

  @IsNotEmpty()
  @ApiProperty({
    enum :AgeLimitStatus,
    isArray:true,
    example : AgeLimitStatus.ADLUT_MORE_THAN
  })
  ageLimitStatus:AgeLimitStatus;
}