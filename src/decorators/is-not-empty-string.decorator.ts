import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export function IsNotEmptyString(min: number, max: number,
                                 example: string, description: string) {
  return applyDecorators(
    IsNotEmpty(),
    ApiProperty({
      example: example,
      description: description,
    }),
    IsString(),
    Length(min, max));
}
