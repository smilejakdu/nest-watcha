import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateGenreRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example:'name',
    description:'name'
  })
  genreName: string;
}

export class UpdateGenreResponseDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example:1,
    description:'id'
  })
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example:'name',
    description:'name'
  })
  genreName: string;
}