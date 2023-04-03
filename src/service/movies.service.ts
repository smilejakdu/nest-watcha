import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CoreResponseDto, HttpRequestResponse, SuccessFulResponse} from '../shared/CoreResponse';
import { DataSource, QueryRunner } from 'typeorm';
import { MovieRepository } from '../database/repository/MovieAndGenreRepository/movie.repository';
import { MovieEntity } from "../database/entities/MovieAndGenre/movie.entity";
import { CreateMovieRequestDto, CreateMovieResponseDto} from "../controller/movies/movie.controller.dto/createMovie.dto";
import { transactionRunner } from "../shared/common/transaction/transaction";
import {CommentsRepository} from "../database/repository/comments.repository";
import MiniSearch from "minisearch";

export class MovieMapper {
  toMovieEntity(createMovieRequestDto: CreateMovieRequestDto) {
    const newMovieEntity = new CreateMovieRequestDto();
    newMovieEntity.movie_title = createMovieRequestDto.movie_title;
    newMovieEntity.movie_image = createMovieRequestDto.movie_image;
    newMovieEntity.movie_score = createMovieRequestDto.movie_score;
    newMovieEntity.age_limit_status = createMovieRequestDto.age_limit_status;
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
    private readonly commentRepository: CommentsRepository,
    private readonly dataSource: DataSource,
    private readonly movieMapper: MovieMapper,
  ) { }

  async createMovie(createMovieRequestDto: CreateMovieRequestDto): Promise<CoreResponseDto> {
    const newMovie = new MovieEntity();
    Object.assign(newMovie, createMovieRequestDto);
    const createdMovie = await transactionRunner(async (queryRunner: QueryRunner) => {
      return await queryRunner.manager.save(MovieEntity, newMovie);
    }, this.dataSource);

    if (!createdMovie) {
      throw new BadRequestException('영화 만들기 실패했습니다.');
    }

    return SuccessFulResponse(
      this.movieMapper.toDto(createdMovie),
      HttpStatus.CREATED,
    );
  }

  async findMovieById(movieId: number) {
    const movie = await this.movieRepository.findOneBy({ id: movieId });
    if (!movie) {
      throw new BadRequestException('Movie not found');
    }
    return SuccessFulResponse(movie);
  }

  async findOneMovie(media_id: number) {
    const foundOneMovie = await this.movieRepository.findOneMovieById(media_id);

    if (!foundOneMovie){
      throw new BadRequestException('Movie not found');
    }

    return SuccessFulResponse(foundOneMovie);
  }

  async findAllMovie(
    pageNumber: number,
    size: number,
  ) {
    const foundAllMovie = await this.movieRepository.findMovieAll(pageNumber, size);
    return SuccessFulResponse(foundAllMovie);
  }

  // 근데 이렇게 하면 한글 검색이 제대로 잡히지않는다.
  async searchByMiniSearch(query: string) {
    const foundMovie = await this.movieRepository.find();
    const miniSearch = new MiniSearch({
      fields: ['movie_title', 'movie_description'],
      storeFields: ['movie_title', 'movie_description'],
    })

    miniSearch.addAll(foundMovie);
    const miniSearchResults = miniSearch.search(query);

    if (miniSearchResults.length === 0) {
      return HttpRequestResponse('Movie not found', HttpStatus.NOT_FOUND);
    }

     const responseMiniSearch = miniSearchResults.map((result) => {
      return {
        id: result.id,
        title: result.movie_title,
        description: result.movie_description,
      }
    });
    return SuccessFulResponse(responseMiniSearch);
  }

  async updateMovieById(movieId: number, set: any) {
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
