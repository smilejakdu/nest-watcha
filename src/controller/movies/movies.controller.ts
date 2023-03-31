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
import { CreateMovieRequestDto } from './movie.controller.dto/createMovie.dto';
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
  async createMovie(@Req() req, @Body() body: CreateMovieRequestDto) {
    const responseCreatedMovie = await this.movieService.createMovie(body);

    if (!responseCreatedMovie.ok) {
      throw new BadRequestException('영화 만들기 실패했습니다.');
    }

    return {
      ok: true,
      statusCode: HttpStatus.CREATED,
      message: 'SUCCESS',
    };
  }

  @ApiOperation({ summary: '모든 영화 가져오기' })
  @ApiOkResponse({ description: '성공' })
  @Get(':movie_id')
  async findOneMovie(
    @Param('media_id', ParseIntPipe) media_id: number,
  ) {
    return this.movieService.findOneMovie(media_id);
  }

  @ApiOperation({ summary: '모든 영화 가져오기' })
  @ApiOkResponse({ description: '성공' })
  @Get()
  async findAllMovie(@Query() pagination: Pagination) {
    const {pageNumber, size } = pagination;
    const parsingPageNumber = (Number(pageNumber) !== 0 && pageNumber) ? pageNumber : 1;
    const parsingSizeNumber = (Number(size) !== 0 && size) ? size : 5;

    return this.movieService.findAllMovie(parsingPageNumber, parsingSizeNumber);
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
    const responseUpdatedMovie = await this.movieService.updateMovieById(id, movieDto);
    await this.genreMovieService.updateGenreMovie(
      {
        genreId: genreId,
        movieId: responseUpdatedMovie.data
      }
    );
    return res.status(responseUpdatedMovie.statusCode).json(responseUpdatedMovie);
  }
}
