import {IsBoolean, IsNumber, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class UserFindResponseDto {
  @IsBoolean()
  @ApiProperty({
    example: 'true',
    description: 'boolean',
  })
  public ok: boolean;

  @IsNumber()
  @ApiProperty({
    example: 200,
    description: 'statusCode',
  })
  public statusCode: number;

  @IsString()
  @ApiProperty({
    example: 'SUCCESS',
    description: 'message',
  })
  public message: string;

  @ApiProperty({
    example: 'data',
    description: 'data',
  })
  public data: any;
}