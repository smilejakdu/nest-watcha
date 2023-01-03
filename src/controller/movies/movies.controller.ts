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
  Req,
  Res,
  UseGuards
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';
import { MoviesService } from '../../service/movies.service';
import { Response } from 'express';
import { CreateMovieDto } from './movie.controller.dto/createMovie.dto';
import { GenreMovieService } from '../../service/genreMovie.service';
import { UpdateMovieDto } from './movie.controller.dto/updateMovie.dto';
import { Pagination } from '../../shared/pagination';
import { UserAuthGuard } from '../../shared/auth/guard/user-auth.guard';
import { PermissionsGuard } from '../../shared/common/permissions/permissionCheck';

@ApiInternalServerErrorResponse({ description: '서버 에러' })
@ApiTags('MOVIES')
@Controller('movies')
export class MoviesController {
  constructor(
    private movieService: MoviesService,
    private genreMovieService: GenreMovieService
  ) {}

  @ApiOperation({ summary: '영화 만들기' })
  @ApiCreatedResponse({ description: '성공' })
  @UseGuards(UserAuthGuard, PermissionsGuard)
  @Post()
  async createMovie(@Req() req, @Body() body: CreateMovieDto) {
    const { genreId, ...movieDto } = body;
    const responseCreatedMovie = await this.movieService.createMovie(body);
    if (!responseCreatedMovie.ok) {
      throw new BadRequestException('영화 만들기 실패했습니다.');
    }
    await this.genreMovieService.createGenreMovie(
      {
        genreId: genreId,
        movieId: responseCreatedMovie.data
      }
    );
    return {
      statusCode: HttpStatus.CREATED,
      message: 'SUCCESS'
    };
  }

  @ApiOperation({ summary: '모든 영화 가져오기' })
  @ApiOkResponse({ description: '성공' })
  @Get()
  async findAllMovie(@Query() pagination: Pagination) {
    return await this.movieService.findAllMovie(pagination.pageNumber);
  }

  @ApiOperation({ summary: '영화 수정하기' })
  @ApiCreatedResponse({ description: '성공' })
  @UseGuards(UserAuthGuard, PermissionsGuard)
  @Put(':id')
  async updateMovie(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateMovieDto,
    @Res() res:Response,
  ) {
    const { genreId, ...movieDto } = body;
    const responseUpdatedMovie = await this.movieService.updateMovieByIds([id], movieDto);
    await this.genreMovieService.updateGenreMovie(
      {
        genreId: genreId,
        movieId: responseUpdatedMovie.data
      }
    );
    return res.status(responseUpdatedMovie.statusCode).json(responseUpdatedMovie);
  }
}