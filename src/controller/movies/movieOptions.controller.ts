import { ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Post } from '@nestjs/common';
import { MovieOptionsService } from '../../service/movieOptions.service';
import { CreateMovieOptionDto } from './movieOption.controller.dto/createMovieOption.dto';

@ApiInternalServerErrorResponse({ description: '서버 에러' })
@ApiTags('MOVIES_OPTIONS')
@Controller('movies_options')
export class MovieOptionsController {
  constructor(
    private readonly movieOptionService:MovieOptionsService,
  ) {}

  @ApiOperation({ summary: '뮤비 옵션 만들기' })
  @ApiCreatedResponse({ description:'성공'})
  @Post()
  async createMovieOption(createMovieOptionDto:CreateMovieOptionDto) {
    return await this.movieOptionService.createMovieOption(createMovieOptionDto);
  }
}