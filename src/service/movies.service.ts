import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CoreResponse, CreateSuccessFulResponse, SuccessResponse } from '../shared/CoreResponse';
import { MovieRepository } from '../database/repository/movie.repository';
import { getConnection, QueryRunner } from 'typeorm';
import { GenreMovieRepository } from '../database/repository/genreMovie.repository';
import { isNil } from '@nestjs/common/utils/shared.utils';

@Injectable()
export class MoviesService{
  constructor(
    private readonly movieRepository: MovieRepository,
    private readonly genreMovieRepository : GenreMovieRepository,
  ) {}

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

    return CreateSuccessFulResponse(createdMovie.raw.insertId);
  }

  async findAllMovie(pagination) {
    const skip = Number((pagination.page - 1) * pagination.limit);
    const foundAllMovie = await this.movieRepository
      .findAll()
      .skip(skip)
      .take(pagination.limit)
      .getMany();

    return SuccessResponse(foundAllMovie);
  }

  async findOneById(id:number): Promise<CoreResponse> {
    const foundOneMovie = await this.movieRepository.findOneById(id).getOne();
    if(isNil(foundOneMovie)) {
      throw new NotFoundException(`does not found movie ${id}`);
    }

    return SuccessResponse(foundOneMovie);
  }

  async updateMovieByIds(ids: number[], set: any, queryRunner?: QueryRunner) {
    const updatedMovie = await this.movieRepository.updateMovieByIds(ids,set);
    return SuccessResponse(updatedMovie.raw.insertId);
  }

  async deleteMovieById(ids:number[],queryRunner?: QueryRunner) {
    const deletedMovie = await this.movieRepository.deleteMovieByIds(ids);
    return SuccessResponse(deletedMovie.raw.insertId);
  }
}


