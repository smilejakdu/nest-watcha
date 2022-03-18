import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res
} from '@nestjs/common';
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
import { CreateMovieDto } from './movie.controller.dto/createMovie.dto';
import { GenreMovieService } from '../../service/genreMovie.service';
import { UpdateMovieDto } from './movie.controller.dto/updateMovie.dto';
import { Pagination } from '../../shared/pagination';

@ApiInternalServerErrorResponse({ description: '서버 에러' })
@ApiTags('MOVIES')
@Controller('movies')
export class MoviesController{
  constructor(
    private movieService : MoviesService,
    private genreMovieService : GenreMovieService,
    ) {}

  @ApiOperation({summary:'영화 만들기'})
  @ApiCreatedResponse({ description:'성공'})
  @Post()
  async createMovie(@Body() body:CreateMovieDto) {
    const {genreId , ...movieDto} = body;
    const responseCreatedMovie = await this.movieService.createMovie(movieDto);
    if(!responseCreatedMovie.ok){
      throw new BadRequestException('영화 만들기 실패했습니다.');
    }
    await this.genreMovieService.createGenreMovie(
      {
        genreId: genreId,
        movieId :responseCreatedMovie.data,
      }
    );
    return {
      statusCode : HttpStatus.CREATED,
      message : 'SUCCESS'
    };
  }

  @ApiOperation({summary:'해당 영화 가져오기'})
  @ApiOkResponse({
    description:'성공',
    type:GetGenreDto,
  })
  @Get(':id')
  async findMovieById(@Param('id', ParseIntPipe) id: number, @Res() res:Response) {
    const responseFoundMovie = await this.movieService.findOneById(id);
    return res.status(HttpStatus.OK).json({
      statusCode:responseFoundMovie.statusCode,
      message : responseFoundMovie.message,
      data : responseFoundMovie.data,
    });
  }

  @ApiOperation({summary:'모든 영화 가져오기'})
  @ApiOkResponse({ description:'성공' })
  @Get()
  async findAllMovie(@Query() pagination: Pagination){
    pagination.page ? (pagination.page = Number(pagination.page)) : (pagination.page = 1);
    pagination.limit ? (pagination.limit = Number(pagination.limit)) : (pagination.limit = 10);

    return await this.movieService.findAllMovie(pagination);
  }

  @ApiOperation({summary:'영화 수정하기'})
  @ApiCreatedResponse({ description:'성공'})
  @Put(':id')
  async updateMovie(@Param('id', ParseIntPipe) id: number,@Body() body:UpdateMovieDto){
    const {genreId , ...movieDto} = body;
    const responseUpdatedMovie = await this.movieService.updateMovieByIds([id],movieDto);
    await this.genreMovieService.updateGenreMovie(
      {
        genreId: genreId,
        movieId :responseUpdatedMovie.data,
      }
    );
    return {
      statusCode : HttpStatus.OK,
      message : 'SUCCESS'
    };
  }
}