import { Controller, Get, HttpStatus, Param, ParseIntPipe, Post, Res } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MoviesService } from '../../database/service/movies.service';
import { GetGenreDto } from '../genre/genre.controller.dto/getGenre.dto';
import { Response } from 'express';
import { createMovieDto } from './movie.controller.dto/createMovie.dto';
import { CoreResponse } from '../../shared/CoreResponse';

@ApiInternalServerErrorResponse({ description: '서버 에러' })
@ApiTags('MOVIES')
@Controller('movies')
export class MoviesController{
  constructor(private movieService : MoviesService) {}

  @ApiOperation({summary:'모든 장르 가져오기'})
  @ApiOkResponse({
    description:'성공',
    type:GetGenreDto,
  })
  @Get(':id')
  async findMovieById(@Param('id', ParseIntPipe) id: number, @Res() res:Response) {
    const responseMovie = await this.movieService.findById(id);
    return res.status(HttpStatus.OK).json({
      statusCode:responseMovie.statusCode,
      message : responseMovie.message,
      data : responseMovie.data,
    });
  }

  @Post()
  async createMovie(createMovieDto:createMovieDto):Promise<CoreResponse> {
    const responseCreatedMovie = await this.movieService.createMovie(createMovieDto);
    return {
      statusCode:responseCreatedMovie.statusCode,
      message:responseCreatedMovie.message,
    };
  }
}