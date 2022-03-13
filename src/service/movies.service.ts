import { HttpStatus, Injectable } from '@nestjs/common';
import { isNil } from 'lodash';
import { CoreResponse } from '../shared/CoreResponse';
import { MovieRepository } from '../database/repository/movie.repository';
import { QueryRunner } from 'typeorm';
import { GenreMovieRepository } from '../database/repository/genreMovie.repository';

@Injectable()
export class MoviesService{
  constructor(
    private readonly movieRepository:MovieRepository,
    private readonly genreMovieRepository : GenreMovieRepository,
  ) {}

  async createMovie(createMovieDto) {
    const createdMovie:number = await this.movieRepository.createMovie(createMovieDto);
    return {
      ok : !isNil(createdMovie),
      statusCode :!isNil(createdMovie) ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST,
      message: !isNil(createdMovie) ?'SUCCESS': 'BAD_REQUEST',
      data:createdMovie,
    };
  }

  async findAllMovie() {
    const foundAllMovie = await this.movieRepository.findAll();
    return {
      ok : !isNil(foundAllMovie),
      statusCode :!isNil(foundAllMovie) ? HttpStatus.OK : HttpStatus.NOT_FOUND,
      message: !isNil(foundAllMovie) ?'SUCCESS': 'NOT_FOUND_GENRE',
      data:!isNil(foundAllMovie) ? foundAllMovie : [],
    };
  }

  async findOneById(id:number): Promise<CoreResponse> {
    const foundOneMovie = await this.movieRepository.findOneById(id);
    return {
      ok : !isNil(foundOneMovie),
      statusCode :!isNil(foundOneMovie) ? HttpStatus.OK : HttpStatus.NOT_FOUND,
      message: !isNil(foundOneMovie) ?'SUCCESS': 'NOT_FOUND_GENRE',
      data:!isNil(foundOneMovie) ? foundOneMovie : [],
    };
  }

  async updateMovieByIds(ids: number[], set: any, queryRunner?: QueryRunner) {
    const updatedMovie = await this.movieRepository.updateMovieByIds(ids,set);
    return {
      ok : !isNil(updatedMovie),
      statusCode :!isNil(updatedMovie) ? HttpStatus.OK : HttpStatus.NOT_FOUND,
      message: !isNil(updatedMovie) ?'SUCCESS': 'BAD_REQUEST',
      data:!isNil(updatedMovie) ? updatedMovie : null,
    };
  }
}















