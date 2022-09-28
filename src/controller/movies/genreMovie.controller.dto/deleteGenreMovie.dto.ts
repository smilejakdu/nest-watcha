import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteGenreMovieDto{
  @IsNotEmpty()
  @ApiProperty({
    description:'genreId',
    example:1,
  })
  genreId : number;
}