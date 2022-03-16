import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsNumberString, IsOptional } from 'class-validator';

export class Pagination {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  page: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  limit: number;
}

export class PaginationResult {
  data: any[];
  page: number;
  limit: number;
  total: number;

  constructor() {
    this.data = [];
    this.page = 0;
    this.limit = 0;
    this.total = 0;
  }
}
