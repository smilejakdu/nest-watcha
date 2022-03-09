import { Body, Controller, Get, HttpStatus, Param, ParseIntPipe, Post, Res } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';
import { MoviesService } from '../../database/service/movies.service';
import { GetGenreDto } from '../genre/genre.controller.dto/getGenre.dto';
import { Response } from 'express';
import { CoreResponse } from '../../shared/CoreResponse';
import { CreateMovieDto } from './movie.controller.dto/createMovie.dto';
import { GenreMovieEntity } from '../../database/entities/GenreMovieEntity';

@ApiInternalServerErrorResponse({ description: '서버 에러' })
@ApiTags('MOVIES')
@Controller('movies')
export class MoviesController{
  constructor(private movieService : MoviesService) {}

  @ApiOperation({summary:'해당 영화 가져오기'})
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

  @ApiOperation({summary:'영화 만들기'})
  @ApiCreatedResponse({ description:'성공'})
  @Post()
  async createMovie(@Body() body:CreateMovieDto):Promise<CoreResponse> {
    const {genreId , ...movieDto} = body;
    const responseCreatedMovie = await this.movieService.createMovie(movieDto);
    await GenreMovieEntity.createGenreMovie(
      {
        genreId: genreId,
        movieId :responseCreatedMovie.movieId,
      }
    );
    return {
      ok :true,
      statusCode : HttpStatus.CREATED,
      message : 'SUCCESS',
    };
  }
}