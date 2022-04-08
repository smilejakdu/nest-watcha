import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CompletePaymentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imp_uid: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  movie_number: number;
}