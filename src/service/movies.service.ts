import { BadRequestException, HttpStatus, Injectable} from '@nestjs/common';
import { SuccessFulResponse } from '../shared/CoreResponse';
import { DataSource, QueryRunner } from 'typeorm';
import { MovieRepository } from '../database/repository/MovieAndGenreRepository/movie.repository';
import {MovieEntity} from "../database/entities/MovieAndGenre/movie.entity";
import {CreateMovieDto} from "../controller/movies/movie.controller.dto/createMovie.dto";
import {transactionRunner} from "../shared/common/transaction/transaction";

@Injectable()
export class MoviesService {
  constructor(
    private readonly movieRepository: MovieRepository,
    private dataSource: DataSource,
  ) { }

  async createMovie(createMovieDto: CreateMovieDto) {
    const createdMovie = await transactionRunner(async (queryRunner: QueryRunner) => {
      return await queryRunner.manager.save(MovieEntity, createMovieDto);
    });
    return SuccessFulResponse(createdMovie, HttpStatus.CREATED);
  }

  async findMovieById(id: number) {
    const movie = await this.movieRepository.findOneBy({ id });
    SuccessFulResponse(movie);
  }

  async findAllMovie(pageNumber= 1) {
    const take = 10;
    const skip = (pageNumber - 1) * take;

    const foundAllMovie = await this.movieRepository
      .findAll()
      .skip(skip)
      .take(take)
      .getMany();

    return SuccessFulResponse(foundAllMovie);
  }

  async updateMovieByIds(ids: number[], set: any, queryRunner?: QueryRunner) {
    const updatedMovie = await this.movieRepository.updateMovieByIds(ids, set);
    return SuccessFulResponse(updatedMovie.raw.insertId);
  }

  async deleteMovieById(ids:number[],queryRunner?: QueryRunner) {
    const deletedMovie = await this.movieRepository.deleteMovieByIds(ids);
    return SuccessFulResponse(deletedMovie.raw.insertId);
  }
}


