import { ApiProperty } from '@nestjs/swagger';
import {IsNotEmpty, IsNumber, IsString} from 'class-validator';

export class CreateGenreRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example:'genreName',
    description:'genreName'
  })
  public genreName: string;
}

export class CreateGenreResponseDto {
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