import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CompletePaymentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imp_uid: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  movie_number: string;
}