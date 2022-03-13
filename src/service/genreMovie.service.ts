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
    return {
      ok : !isNil(createdGenreMovie),
      statusCode :!isNil(createdGenreMovie) ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST,
      message: !isNil(createdGenreMovie) ?'SUCCESS': 'BAD_REQUEST',
      data:!isNil(createdGenreMovie) ? createdGenreMovie : null,
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