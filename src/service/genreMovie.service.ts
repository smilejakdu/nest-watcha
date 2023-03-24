import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { GenreMovieRepository } from '../database/repository/MovieAndGenreRepository/genreMovie.repository';
import { CreateGenreMovieDto } from '../controller/movies/genreMovie.controller.dto/createGenreMovie.dto';
import { isNil } from 'lodash';
import { UpdateGenreMovieDto } from '../controller/movies/genreMovie.controller.dto/updateGenreMovie.dto';
import { SuccessFulResponse } from '../shared/CoreResponse';

@Injectable()
export class GenreMovieService{
  constructor(
    private readonly genreMovieRepository: GenreMovieRepository,
  ) {}

  async createGenreMovie(createGenreMovieDto : CreateGenreMovieDto) {
    const createdGenreMovie = await this.genreMovieRepository.createGenreMovie(createGenreMovieDto);

    if (!createGenreMovieDto) {
      throw new BadRequestException('BAD_REQUEST');
    }

    return SuccessFulResponse(createdGenreMovie,HttpStatus.CREATED);
  }

  async updateGenreMovie(updateGenreMovieDto : UpdateGenreMovieDto) {
    const updatedGenreMovie = await this.genreMovieRepository.updateGenreMovie(updateGenreMovieDto);
    if(!isNil(updatedGenreMovie)){
      throw new BadRequestException('BAD REQUEST');
    }
    return SuccessFulResponse(updatedGenreMovie);
  }
}