import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteGenreDto{
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example:1,
    description:'장르 아이디'
  })
  id: number;
}