import { applyDecorators } from '@nestjs/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {IsOptional, IsString, MaxLength} from 'class-validator';


export function IsOptionalStringMaxLength(max_length: number,
                                          example: string,
                                          description: string)
{
  return applyDecorators(
    IsOptional(),
    ApiPropertyOptional({
      example: example,
      description: description,
    }),
    MaxLength(max_length),
    IsString());
}
