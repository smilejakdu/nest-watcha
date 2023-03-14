import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsNumberString, IsOptional } from 'class-validator';

export class Pagination {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  pageNumber?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  size?: number;
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
