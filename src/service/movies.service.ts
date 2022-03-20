import { HttpStatus, Injectable } from '@nestjs/common';
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
      ok : true,
      statusCode : HttpStatus.CREATED,
      message: 'SUCCESS',
      data:createdMovie.raw.insertId,
    };
  }

  async findAllMovie(pagination) {
    const skip = Number((pagination.page - 1) * pagination.limit);
    const foundAllMovie =  await this.movieRepository
      .findAll()
      .skip(skip)
      .take(pagination.limit)
      .getMany();

    return {
      ok : true,
      statusCode :HttpStatus.OK,
      message: 'SUCCESS',
      data:foundAllMovie ,
    };
  }

  async findOneById(id:number): Promise<CoreResponse> {
    const foundOneMovie = await this.movieRepository.findOneById(id).getOne();
    return {
      ok : true,
      statusCode :HttpStatus.OK,
      message: 'SUCCESS',
      data:foundOneMovie,
    };
  }

  async updateMovieByIds(ids: number[], set: any, queryRunner?: QueryRunner) {
    const updatedMovie = await this.movieRepository.updateMovieByIds(ids,set);
    return {
      ok : true,
      statusCode :HttpStatus.OK,
      message: 'SUCCESS',
      data: updatedMovie.raw.insertId,
    };
  }

  async deleteMovieById(ids:number[],queryRunner?: QueryRunner) {
    const deletedMovie = await this.movieRepository.deleteMovieByIds(ids);
    return {
      ok : true,
      statusCode : HttpStatus.OK,
      message: 'SUCCESS',
      data: deletedMovie.raw.insertId,
    };
  }
}


