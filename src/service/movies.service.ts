import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CoreResponse, SuccessFulResponse } from '../shared/CoreResponse';
import { MovieRepository } from '../database/repository/MovieAndGenreRepository/movie.repository';
import { getConnection, QueryRunner } from 'typeorm';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { AbstractService } from '../shared/abstract.service';

@Injectable()
export class MoviesService extends AbstractService {
  constructor(
    private readonly movieRepository: MovieRepository,
  ) {
    super(movieRepository);
  }

  async createMovie(createMovieDto) {
    const queryRunner = await getConnection().createQueryRunner();
    await queryRunner.startTransaction();
    let createdMovie;
    try{
      createdMovie = await this.movieRepository.createMovie(createMovieDto,queryRunner.manager);
    }catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
    }finally {
      await queryRunner.release();
    }

    if(!createdMovie){
      throw new BadRequestException('BAD REQUEST');
    }

    return SuccessFulResponse(createdMovie.raw.insertId,HttpStatus.CREATED);
  }

  async findAllMovie(pagination) {
    const skip = Number((pagination.page - 1) * pagination.limit);
    const foundAllMovie = await this.movieRepository
      .findAll()
      .skip(skip)
      .take(pagination.limit)
      .getMany();

    return SuccessFulResponse(foundAllMovie);
  }

  async updateMovieByIds(ids: number[], set: any, queryRunner?: QueryRunner) {
    const updatedMovie = await this.movieRepository.updateMovieByIds(ids,set);
    return SuccessFulResponse(updatedMovie.raw.insertId);
  }

  async deleteMovieById(ids:number[],queryRunner?: QueryRunner) {
    const deletedMovie = await this.movieRepository.deleteMovieByIds(ids);
    return SuccessFulResponse(deletedMovie.raw.insertId);
  }
}


