import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CompletePaymentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imp_uid: string;


  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  merchant_uid: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  impUid: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  movie_id: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  orderNumber: string;
}