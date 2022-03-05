import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { AgeLimitStatus } from '../../../database/entities/GenreEntity';

export class createMovieDto {
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
    example:4.5,
    description:'movieScore'
  })
  movieImage: {mainImage:string, subImage:string};

  @IsNotEmpty()
  @ApiProperty({ type: [String] })
  director:string[]

  @IsNotEmpty()
  @ApiProperty({ type: [String] })
  appearance:string[]

  @IsNotEmpty()
  @ApiProperty({enum :AgeLimitStatus})
  ageLimitStatus:AgeLimitStatus;
}