import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GenreService } from '../../database/service/genre.service';
import { CoreResponse } from '../../shared/CoreResponse';
import { GetGenreDto } from './genre.controller.dto/getGenre.dto';
import { createGenreDto } from './genre.controller.dto/createGenre.dto';

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
  async findAllGenre():Promise<CoreResponse>{
    const responseAllGenre = await this.genreService.findAllGenre();
    return {
      statusCode : responseAllGenre.statusCode,
      message:responseAllGenre.message,
      data:responseAllGenre.data,
    };
  }

  @ApiOperation({summary:'장르 가져오기'})
  @ApiOkResponse({
    description:'성공',
    type:GetGenreDto,
  })
  @Get(':id')
  async findOneGenre(@Param('id',ParseIntPipe) id :number):Promise<CoreResponse> {
    const responseGenre = await this.genreService.findById(id);
    return {
      statusCode:responseGenre.statusCode,
      message : responseGenre.message,
      data : responseGenre.data,
    };
  }

  @ApiOperation({summary:'장르 만들기'})
  @ApiOkResponse({
    description:'성공',
    type:GetGenreDto,
  })
  @Post()
  async createGenre(@Body() body:createGenreDto): Promise<CoreResponse> {
    const responseCreatedGenre = await this.genreService.createGenre(body.genreName);
    return{
      statusCode : responseCreatedGenre.statusCode,
      message : responseCreatedGenre.message,
    };
  }
}