import {
  Brackets,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { MovieEntity } from '../../entities/MovieAndGenre/movie.entity';
import { CustomRepository } from "../../../shared/typeorm-ex.decorator";
import {GetMovieListDto} from "../../../controller/movies/movie.controller.dto/getMovie.dto";

export interface MovieRepositoryInterface {
  id: number;
  title: string;
  description: string;
  price: number;
  movie_score: number;
  age_limit_status: string;
  genre_id: number;
  genre_name: string;
}

@CustomRepository(MovieEntity)
export class MovieRepository extends Repository<MovieEntity>{
  makeQueryBuilder(queryRunner?: QueryRunner): SelectQueryBuilder<MovieEntity> {
    return this.createQueryBuilder('movies', queryRunner);
  }

  async findMovieAll(
    pageNumber: number,
    size: number,
    query: GetMovieListDto,
  ) {
    const { movie_keyword, director, appearance } = query;

    const findQuery = await this.makeQueryBuilder()
      .select([
        'movies.id',
        'movies.title title',
        'movies.description description',
        'movies.price price',
        'movies.movie_score movie_score',
        'movies.age_limit_status age_limit_status',
        'genre.id genre_id',
        'genre.name genre_name',
      ])
      .innerJoin('movies.genreMovie','genreMovie')
      .innerJoin('genreMovie.genre','genre')

    if (movie_keyword) {
      findQuery.andWhere(
        new Brackets((qb) => {
          qb.where('movies.title LIKE :keyword', { keyword: `%${movie_keyword}%` });
          qb.orWhere('movies.description LIKE :keyword', { keyword: `%${movie_keyword}%` });
        })
      );
    }

    const skip = (Number(pageNumber) - 1) * size;

    const countQuery = findQuery.clone().select('COUNT(*) total_count');
    const countResult = await countQuery.getRawOne< { total_count: string } >();

    const totalCount = parseInt(countResult.total_count, 10);
    const paginatedData = await findQuery
      .offset(skip)
      .limit(size)
      .getRawMany<MovieRepositoryInterface>();
    const lastPage = Math.ceil(totalCount / size);
    const nextPage = Number(pageNumber) >= lastPage ? null : Number(pageNumber) + 1;

    return {
      nextPage: nextPage,
      lastPage: lastPage,
      totalCount: totalCount,
      movieData: paginatedData,
    }
  }

  async findOneMovieAndReviewAvgById(media_id: number) {
    const reviewAvgQuery = this.makeQueryBuilder()
      .select([
        'ROUND(AVG(movieReviews.like_counts), 1) as likes_count_avg',
      ])
      .leftJoin('movies.movieReviews', 'movieReviews')
      .where(`movies.id=:id`, { id: media_id})
      .groupBy('movies.id')

    const movieQuery = this.makeQueryBuilder()
      .where('movies.id=:id', {id: media_id})

    const [foundReviewAvgByMediaId, foundOneMovie] = await Promise.all([
      reviewAvgQuery.getRawOne(),
      movieQuery.getOne(),
    ]);

    foundOneMovie.like_counts_avg = foundReviewAvgByMediaId?.likes_count_avg ?? 0;
    return foundOneMovie;
  }

  async deleteMovieByIds(ids: number[], queryRunner?: QueryRunner) {
    return this.makeQueryBuilder(queryRunner)
      .softDelete()
      .from(MovieEntity)
      .where('movies.id in (:ids) ', {ids})
      .execute();
  }
}