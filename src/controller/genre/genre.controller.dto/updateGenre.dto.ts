import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateGenreDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example:'name',
    description:'name'
  })
  name: string;
}