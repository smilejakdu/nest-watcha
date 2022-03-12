import { BadRequestException, Body, Controller, Get, HttpStatus, Param, ParseIntPipe, Post, Res } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';
import { MoviesService } from '../../service/movies.service';
import { GetGenreDto } from '../genre/genre.controller.dto/getGenre.dto';
import { Response } from 'express';
import { CoreResponse } from '../../shared/CoreResponse';
import { CreateMovieDto } from './movie.controller.dto/createMovie.dto';
import { GenreMovieEntity } from '../../database/entities/genreMovie.entity';

@ApiInternalServerErrorResponse({ description: '서버 에러' })
@ApiTags('MOVIES')
@Controller('movies')
export class MoviesController{
  constructor(
    private movieService : MoviesService) {}

  @ApiOperation({summary:'해당 영화 가져오기'})
  @ApiOkResponse({
    description:'성공',
    type:GetGenreDto,
  })
  @Get(':id')
  async findMovieById(@Param('id', ParseIntPipe) id: number, @Res() res:Response) {
    const responseMovie = await this.movieService.findOneById(id);
    return res.status(HttpStatus.OK).json({
      statusCode:responseMovie.statusCode,
      message : responseMovie.message,
      data : responseMovie.data,
    });
  }

  @ApiOperation({summary:'영화 만들기'})
  @ApiCreatedResponse({ description:'성공'})
  @Post()
  async createMovie(@Body() body:CreateMovieDto):Promise<CoreResponse> {
    const {genreId , ...movieDto} = body;
    const responseCreatedMovie = await this.movieService.createMovie(movieDto);
    if(!responseCreatedMovie.ok){
      throw new BadRequestException('영화 만들기 실패했습니다.');
    }
    const test = await GenreMovieEntity.createGenreMovie(
      {
        genreId: genreId,
        movieId :responseCreatedMovie.data,
      }
    );
    return {
      ok :true,
      statusCode : HttpStatus.CREATED,
      message : 'SUCCESS',
    };
  }
}