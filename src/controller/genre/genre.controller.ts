import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
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
import { UpdateGenreDto } from './genre.controller.dto/updateGenre.dto';
import { DeleteGenreDto } from './genre.controller.dto/deleteGenre.dto';

@ApiInternalServerErrorResponse({ description: '서버 에러' })
@ApiTags('GENRE')
@Controller('genre')
export class GenreController {
  constructor(private genreService: GenreService) {}

  @ApiOperation({summary:'장르 만들기'})
  @ApiCreatedResponse({
    description:'성공',
    type:GetGenreDto,
  })
  @Post()
  async createGenre(@Body() body:createGenreDto) {
    return await this.genreService.createGenre(body.genreName);
  }

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

  @ApiOperation({summary:'장르 업데이트'})
  @ApiOkResponse({
    description:'업데이트 성공',
    type:UpdateGenreDto,
  })
  @Patch(':id')
  async updateOneGenre(@Param('id',ParseIntPipe) id :number,@Body() body:UpdateGenreDto){
    return await this.genreService.updateGenre({
      id :id,
      name : body.name
    });
  }

  @ApiOperation({summary:'장르 삭제하기'})
  @ApiOkResponse({
    description:'삭제하기 성공',
    type: DeleteGenreDto,
  })
  @Delete(':id')
  async deleteOneGenre(@Param('id',ParseIntPipe) id :number){
    return await this.genreService.deletedGenre(id);
  }
}