import { applyDecorators } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export function IsNotEmptyNumber(example: number,
                                 description:string) {
  return applyDecorators(
    IsInt(),
    IsNotEmpty(),
    ApiProperty({
      example: example,
      description: description,
    }),
    Type(() => Number),
  );
}
