import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetMovieDto{
  @IsNotEmpty()
  @ApiProperty({
    example:1,
    description:'movieId',
  })
  movieId:number;
}