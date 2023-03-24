import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CoreResponse, SuccessFulResponse } from '../shared/CoreResponse';
import { DataSource, QueryRunner } from 'typeorm';
import { MovieRepository } from '../database/repository/MovieAndGenreRepository/movie.repository';
import { MovieEntity } from "../database/entities/MovieAndGenre/movie.entity";
import { CreateMovieRequestDto, CreateMovieResponseDto} from "../controller/movies/movie.controller.dto/createMovie.dto";
import { transactionRunner } from "../shared/common/transaction/transaction";

export class MovieMapper {
  toMovieEntity(createMovieRequestDto: CreateMovieRequestDto) {
    const newMovieEntity = new CreateMovieRequestDto();
    newMovieEntity.movieTitle = createMovieRequestDto.movieTitle;
    newMovieEntity.movieImage = createMovieRequestDto.movieImage;
    newMovieEntity.movieScore = createMovieRequestDto.movieScore;
    newMovieEntity.ageLimitStatus = createMovieRequestDto.ageLimitStatus;
    newMovieEntity.genreId = createMovieRequestDto.genreId;
    newMovieEntity.appearance = createMovieRequestDto.appearance;
    newMovieEntity.director = createMovieRequestDto.director;
    return newMovieEntity;
  }

  toDto(movieEntity: MovieEntity): CreateMovieResponseDto {
    const createMovieResponseDto = new CreateMovieResponseDto();
    createMovieResponseDto.movieId = movieEntity.id;
    createMovieResponseDto.movieName = movieEntity.movie_title;
    return createMovieResponseDto;
  }
}

@Injectable()
export class MoviesService {
  constructor(
    private readonly movieRepository: MovieRepository,
    private readonly dataSource: DataSource,
    private readonly movieMapper: MovieMapper,
  ) { }

  async createMovie(createMovieRequestDto: CreateMovieRequestDto): Promise<CoreResponse> {
    const createdMovie = await transactionRunner(async (queryRunner: QueryRunner) => {
      return await queryRunner.manager.save(MovieEntity, createMovieRequestDto);
    });

    return SuccessFulResponse(this.movieMapper.toDto(createdMovie),HttpStatus.CREATED);
  }

  async findMovieById(movieId: number) {
    const movie = await this.movieRepository.findOneBy({ id: movieId });
    if (!movie) {
      throw new BadRequestException('Movie not found');
    }
    return SuccessFulResponse(movie);
  }

  async findAllMovie(
    pageNumber: number,
    size: number,
  ) {
    const foundAllMovie = await this.movieRepository.findMovieAll(pageNumber, size);
    return SuccessFulResponse(foundAllMovie);
  }

  async updateMovieById(movieId: number, set: any, queryRunner?: QueryRunner) {
    const foundMovie = await this.movieRepository.findOneBy({ id: movieId });
    if (!foundMovie) {
      throw new BadRequestException('Movie not found');
    }

    Object.assign(foundMovie, set);
    const updatedMovie = await transactionRunner(async (queryRunner: QueryRunner) => {
      return await queryRunner.manager.save(MovieEntity, foundMovie);
    });

    const responseMovie = this.movieMapper.toDto(updatedMovie);
    return SuccessFulResponse(responseMovie);
  }

  async deleteMovieById(ids:number[], queryRunner?: QueryRunner) {
    const deletedMovie = await this.movieRepository.deleteMovieByIds(ids);
    return SuccessFulResponse(deletedMovie.raw.insertId);
  }
}


