import { ApiPropertyOptional } from "@nestjs/swagger";
import {IsNumberString, IsOptional } from "class-validator";

export class Pagination {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  pageNumber?: number;
}