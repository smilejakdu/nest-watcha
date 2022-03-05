import { Body, Controller, Get, HttpStatus, Param, ParseIntPipe, Post, Res } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';
import { GenreService } from '../../database/service/genre.service';
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
  async findAllGenre(@Res() res:Response) {
    const responseAllGenre = await this.genreService.findAllGenre();
    return res.status(HttpStatus.OK).json({
      statusCode:responseAllGenre.statusCode,
      message : responseAllGenre.message,
      data : responseAllGenre.data,
    });
  }

  @ApiOperation({summary:'장르 가져오기'})
  @ApiOkResponse({
    description:'성공',
    type:GetGenreDto,
  })
  @Get(':id')
  async findOneGenre(@Param('id',ParseIntPipe) id :number, @Res() res:Response) {
    const responseGenre = await this.genreService.findById(id);
    return res.status(HttpStatus.OK).json({
      statusCode:responseGenre.statusCode,
      message : responseGenre.message,
      data : responseGenre.data,
    });
  }

  @ApiOperation({summary:'장르 만들기'})
  @ApiCreatedResponse({
    description:'성공',
    type:GetGenreDto,
  })
  @Post()
  async createGenre(@Body() body:createGenreDto, @Res() res: Response) {
    const responseCreatedGenre = await this.genreService.createGenre(body.genreName);
    return res.status(HttpStatus.CREATED).json({
      statusCode : responseCreatedGenre.statusCode,
      message : responseCreatedGenre.message,
    });
  }
}