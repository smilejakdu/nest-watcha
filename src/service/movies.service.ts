import { HttpStatus, Injectable } from '@nestjs/common';
import { isNil } from 'lodash';
import { CoreResponse } from '../shared/CoreResponse';
import { MovieRepository } from '../database/repository/movie.repository';
import { QueryRunner } from 'typeorm';
import { GenreMovieRepository } from '../database/repository/genreMovie.repository';

@Injectable()
export class MoviesService{
  constructor(
    private readonly movieRepository: MovieRepository,
    private readonly genreMovieRepository : GenreMovieRepository,
  ) {}

  async createMovie(createMovieDto) {
    const createdMovie = await this.movieRepository.createMovie(createMovieDto);
    return {
      ok : !isNil(createdMovie),
      statusCode :!isNil(createdMovie) ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST,
      message: !isNil(createdMovie) ?'SUCCESS': 'BAD_REQUEST',
      data:createdMovie,
    };
  }

  async findAllMovie(pagination) {
    const skip = Number((pagination.page - 1) * pagination.limit);
    const foundAllMovie = await this.movieRepository
      .findAll()
      .skip(skip)
      .take(pagination.limit)
      .getMany();
  }

  async findOneById(id:number): Promise<CoreResponse> {
    const foundOneMovie = await this.movieRepository.findOneById(id).getOne();
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

  async deleteMovieById(ids:number[],queryRunner?: QueryRunner) {
    const deletedMovie = await this.movieRepository.deleteMovieByIds(ids);
    return {
      ok : !isNil(deletedMovie),
      statusCode :!isNil(deletedMovie) ? HttpStatus.OK : HttpStatus.NOT_FOUND,
      message: !isNil(deletedMovie) ?'SUCCESS': 'BAD_REQUEST',
      data:!isNil(deletedMovie) ? deletedMovie : null,
    };
  }
}















