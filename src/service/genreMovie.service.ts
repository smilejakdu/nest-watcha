import { HttpStatus, Injectable } from '@nestjs/common';
import { GenreMovieRepository } from '../database/repository/genreMovie.repository';
import { CreateGenreMovieDto } from '../controller/movies/genreMovie.controller.dto/createGenreMovie.dto';
import { isNil } from 'lodash';
import { UpdateGenreMovieDto } from '../controller/movies/genreMovie.controller.dto/updateGenreMovie.dto';

@Injectable()
export class GenreMovieService{
  constructor(
    private readonly genreMovieRepository: GenreMovieRepository,
  ) {}

  async createGenreMovie(createGenreMovieDto : CreateGenreMovieDto){
    const createdGenreMovie = await this.genreMovieRepository.createGenreMovie(createGenreMovieDto);
    if (!createGenreMovieDto){
      return {
        ok : false,
        statusCode : HttpStatus.BAD_REQUEST,
        message:  'BAD_REQUEST',
        data: null,
      };
    }
    return {
      ok : true,
      statusCode : HttpStatus.CREATED,
      message: 'SUCCESS',
      data: createdGenreMovie,
    };
  }

  async updateGenreMovie(updateGenreMovieDto : UpdateGenreMovieDto) {
    const updatedGenreMovie = await this.genreMovieRepository.updateGenreMovie(updateGenreMovieDto);
    return {
      ok : !isNil(updatedGenreMovie),
      statusCode :!isNil(updatedGenreMovie) ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST,
      message: !isNil(updatedGenreMovie) ?'SUCCESS': 'BAD_REQUEST',
      data:!isNil(updatedGenreMovie) ? updatedGenreMovie : null,
    };
  }
}