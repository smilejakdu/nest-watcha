import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class createGenreDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example:'genreName',
    description:'genreName'
  })
  public genreName: string;
}