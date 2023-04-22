import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGenreMovieDto {
  @IsNotEmpty()
  @ApiProperty({
    description:'movie_id',
    example:1,
  })
  movie_id : number;

  @IsNotEmpty()
  @ApiProperty({
    description:'genre_id',
    example:1,
  })
  genre_id : number;
}
