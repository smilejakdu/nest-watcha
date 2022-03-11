import { Body, Controller, Get, Param, ParseIntPipe, Post, Res } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';
import { GenreService } from '../../service/genre.service';
import { GetGenreDto } from './genre.controller.dto/getGenre.dto';
import { createGenreDto } from './genre.controller.dto/createGenre.dto';
import { Response } from 'express';

@ApiInternalServerErrorResponse({ description: '서버 에러' })
@ApiTags('GENRE')
@Controller('genre')
export class GenreController {
  constructor(private genreService: GenreService) {}

  @ApiOperation({summary:'모든 장르 가져오기'})
  @ApiOkResponse({
    description:'성공',
    type:GetGenreDto,
  })
  @Get()
  async findAllGenre() {
    return this.genreService.findAllGenre();
  }

  @ApiOperation({summary:'장르 가져오기'})
  @ApiOkResponse({
    description:'성공',
    type:GetGenreDto,
  })
  @Get(':id')
  async findOneGenre(@Param('id',ParseIntPipe) id :number) {
    return await this.genreService.findById(id);
  }

  @ApiOperation({summary:'장르와 영화 가져오기'})
  @ApiOkResponse({
    description:'성공',
    type:GetGenreDto,
  })
  @Get(':id')
  async findWithMovieById(@Param('id',ParseIntPipe) id :number) {
    return await this.genreService.findWithMovieById(id);
  }

  @ApiOperation({summary:'장르 만들기'})
  @ApiCreatedResponse({
    description:'성공',
    type:GetGenreDto,
  })
  @Post()
  async createGenre(@Body() body:createGenreDto) {
    return await this.genreService.createGenre(body.genreName);
  }
}