import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMovieOptionDto {
  @IsNotEmpty()
  @ApiProperty({
    example:1,
    description:'price'
  })
  price: number;
}