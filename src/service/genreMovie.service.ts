import { BadRequestException, Injectable } from '@nestjs/common';
import { GenreMovieRepository } from '../database/repository/genreMovie.repository';
import { CreateGenreMovieDto } from '../controller/movies/genreMovie.controller.dto/createGenreMovie.dto';
import { isNil } from 'lodash';
import { UpdateGenreMovieDto } from '../controller/movies/genreMovie.controller.dto/updateGenreMovie.dto';
import { CreateSuccessFulResponse, SuccessResponse } from '../shared/CoreResponse';

@Injectable()
export class GenreMovieService{
  constructor(
    private readonly genreMovieRepository: GenreMovieRepository,
  ) {}

  async createGenreMovie(createGenreMovieDto : CreateGenreMovieDto){
    const createdGenreMovie = await this.genreMovieRepository.createGenreMovie(createGenreMovieDto);
    if (!createGenreMovieDto) {
      throw new BadRequestException('BAD_REQUEST');
    }
    return CreateSuccessFulResponse(createdGenreMovie);
  }

  async updateGenreMovie(updateGenreMovieDto : UpdateGenreMovieDto) {
    const updatedGenreMovie = await this.genreMovieRepository.updateGenreMovie(updateGenreMovieDto);
    if(!isNil(updatedGenreMovie)){
      throw new BadRequestException('BAD REQUEST');
    }
    return SuccessResponse(updatedGenreMovie);
  }
}