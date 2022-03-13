import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGenreMovieDto {
  @IsNotEmpty()
  @ApiProperty({
    description:'movieId',
    example:1,
  })
  movieId : number;

  @IsNotEmpty()
  @ApiProperty({
    description:'genreId',
    example:1,
  })
  genreId : number;
}
