import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetGenreDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example:200,
    description:'statusCode'
  })
  statusCode: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example:'SUCCESS',
    description:'message'
  })
  message: string;

  @ApiProperty({
    example:'object',
    description:'object'
  })
  data?:any;
}