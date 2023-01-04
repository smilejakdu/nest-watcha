import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteGenreRequestDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example:1,
    description:'장르 아이디'
  })
  id: number;
}

export class DeleteGenreResponseDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example:1,
    description:'장르 아이디'
  })
  id: number;
}