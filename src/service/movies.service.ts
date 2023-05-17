import { MovieEntity } from "../database/entities/MovieAndGenre/movie.entity";
import {
  CreateMovieRequestDto,
  CreateMovieResponseDto
} from "../controller/movies/movie.controller.dto/createMovie.dto";
import { transactionRunner } from "../shared/common/transaction/transaction";
import { CommentsRepository } from "../database/repository/comments.repository";
import {BadRequestException, HttpStatus, Injectable} from "@nestjs/common";
import {BadRequest, CoreResponseDto, SuccessFulResponse} from "../shared/CoreResponse";
import {DataSource, QueryRunner} from "typeorm";
import {MovieRepository} from "../database/repository/MovieAndGenreRepository/movie.repository";
import {MovieReviewRepository} from "../database/repository/movieReview.repository";
import {GetMovieListDto} from "../controller/movies/movie.controller.dto/getMovie.dto";

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
    createMovieResponseDto.movieName = movieEntity.title;
    return createMovieResponseDto;
  }
}

export interface MovieLikesCountAvgInterface {
  like_counts_avg: string;
}

@Injectable()
export class MoviesService {
  constructor(
    private readonly movieRepository: MovieRepository,
    private readonly commentRepository: CommentsRepository,
    private readonly dataSource: DataSource,
    private readonly movieMapper: MovieMapper,
    private readonly movieReviewRepository: MovieReviewRepository,
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
      createdMovie,
      HttpStatus.CREATED,
    );
  }

  async searchMovie(keyword: string){
    const foundMovie = await this.movieRepository.searchMovieByTitleOrDescription(keyword);

    if (!foundMovie) {
      return BadRequest('Movie not found', HttpStatus.NOT_FOUND);
    }

    const result =  foundMovie.sort((a, b) => {
      const aKeywordIndex = a.name.indexOf(keyword);
      const bKeywordIndex = b.name.indexOf(keyword);

      if (aKeywordIndex === 0 && bKeywordIndex !== 0) {
        return -1;
      }
      if (bKeywordIndex === 0 && aKeywordIndex !== 0) {
        return 1;
      }
      return a.name.localeCompare(b.name);
    });

    return SuccessFulResponse(result);
  }

  async findOneMovie(media_id: number) {
    const foundOneMovie = await this.movieRepository.findOneMovieAndReviewAvgById(media_id);

    if (!foundOneMovie) {
      return BadRequest('Movie not found', HttpStatus.NOT_FOUND);
    }

    // 각각의 like_counts를 합산
    let totalLikes = 0;
    foundOneMovie.forEach(movie => {
      totalLikes += movie.movieReviews.reduce((sum, review) => sum + review.like_counts, 0);
    });

    const avgLikes = totalLikes / foundOneMovie[0].movieReviews.length;
    foundOneMovie[0].like_counts_avg = avgLikes;

    return SuccessFulResponse({
      movie: foundOneMovie,
    });
  }

  async findAllMovie(
    pageNumber: number,
    size: number,
    query: GetMovieListDto,
  ) {
    const {
      nextPage,
      lastPage,
      totalCount,
      movieData,
    } = await this.movieRepository.findMovieAll(pageNumber, size, query);

    return SuccessFulResponse({
      nextPage,
      lastPage,
      totalCount,
      movieData,
    });
  }

  async updateMovieById(movieId: number, set: any) {
    const foundMovie = await this.movieRepository.findOneBy({ id: movieId });
    if (!foundMovie) {
      throw new BadRequestException('Movie not found');
    }

    Object.assign(foundMovie, set);
    const updatedMovie = await transactionRunner<MovieEntity>(async (queryRunner: QueryRunner) => {
      return await queryRunner.manager.save(MovieEntity, foundMovie);
    });

    const responseMovie = this.movieMapper.toDto(updatedMovie);
    return SuccessFulResponse(responseMovie);
  }
}
