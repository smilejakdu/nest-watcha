import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CoreResponse, SuccessFulResponse } from '../shared/CoreResponse';
import { DataSource, QueryRunner } from 'typeorm';
import { MovieRepository } from '../database/repository/MovieAndGenreRepository/movie.repository';
import { MovieEntity } from "../database/entities/MovieAndGenre/movie.entity";
import { CreateMovieRequestDto, CreateMovieResponseDto} from "../controller/movies/movie.controller.dto/createMovie.dto";
import { transactionRunner } from "../shared/common/transaction/transaction";

@Injectable()
export class MoviesService {
  constructor(
    private readonly movieRepository: MovieRepository,
    private dataSource: DataSource,
  ) { }

  async createMovie(createMovieRequestDto: CreateMovieRequestDto): Promise<CoreResponse> {
    const createdMovie = await transactionRunner(async (queryRunner: QueryRunner) => {
      return await queryRunner.manager.save(MovieEntity, createMovieRequestDto);
    });

    const createMovieResponseDto = new CreateMovieResponseDto();
    createMovieResponseDto.movieId = createdMovie.id;
    createMovieResponseDto.movieName = createdMovie.movieName;

    return SuccessFulResponse(createMovieResponseDto, HttpStatus.CREATED);
  }

  async findMovieById(movieId: number) {
    const movie = await this.movieRepository.findOneBy({ id: movieId });
    if (!movie) {
      throw new BadRequestException('Movie not found');
    }
    return SuccessFulResponse(movie);
  }

  async findAllMovie(pageNumber= 1) {
    const foundAllMovie = await this.movieRepository.findAll(pageNumber);
    return SuccessFulResponse(foundAllMovie);
  }

  async updateMovieByIds(ids: number[], set: any, queryRunner?: QueryRunner) {
    const updatedMovie = await this.movieRepository.updateMovieByIds(ids, set);
    return SuccessFulResponse(updatedMovie.raw.insertId);
  }

  async deleteMovieById(ids:number[], queryRunner?: QueryRunner) {
    const deletedMovie = await this.movieRepository.deleteMovieByIds(ids);
    return SuccessFulResponse(deletedMovie.raw.insertId);
  }
}


