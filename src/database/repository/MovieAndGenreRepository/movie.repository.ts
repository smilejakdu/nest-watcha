import {
  Brackets,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { MovieEntity } from '../../entities/MovieAndGenre/movie.entity';
import { GetMovieListDto } from "../../../controller/movies/movie.controller.dto/getMovie.dto";
import {CustomRepository} from "../../../shared/typeorm/typeorm-ex.decorator";

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
    const { movie_keyword, director, appearance, order_by } = query;

    const findQuery = await this.makeQueryBuilder()
      .select([
        'movies.id',
        'movies.title',
        'movies.description',
        'movies.price',
        'movies.movie_score',
        'movies.age_limit_status',
      ])
      .addSelect([
        'genreMovie.id',
      ])
      .addSelect([
        'genre.id',
        'genre.name'
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
    const orderByDirection = order_by === 'DESC' ? 'DESC' : 'ASC';

    const paginatedData = await findQuery
      .offset(skip)
      .limit(size)
      .orderBy(
        `
      CASE
        WHEN movies.title REGEXP '^[가-힣]' THEN CONCAT('1', movies.title)
        WHEN movies.title REGEXP '^[a-zA-Z0-9]' THEN CONCAT('2', movies.title)
        ELSE CONCAT('3', movies.title)
      END
    `, orderByDirection
      )
      .getMany();

    // const result =  advertiserData.sort((a, b) => {
    //   const aKeywordIndex = a.name.indexOf(keyword);
    //   const bKeywordIndex = b.name.indexOf(keyword);
    //
    //   if (aKeywordIndex === 0 && bKeywordIndex !== 0) {
    //     return -1;
    //   }
    //   if (bKeywordIndex === 0 && aKeywordIndex !== 0) {
    //     return 1;
    //   }
    //   return a.name.localeCompare(b.name);
    // });

    // .getRawMany<MovieRepositoryInterface>();
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
    return this.makeQueryBuilder()
      .select([
        'movies.id',
        'movies.title',
        'movies.description',
        'movies.price',
        'movies.movie_score',
        'movies.age_limit_status',
        'movieReviews.id',
        'movieReviews.content',
        'movieReviews.like_counts',
        'movieReviews.createdAt',
        'movieReviews.updatedAt',
      ])
      .leftJoin('movies.movieReviews', 'movieReviews')
      .where('movies.id=:id', {id: media_id})
      .getMany();
  }

  async deleteMovieByIds(ids: number[], queryRunner?: QueryRunner) {
    return this.makeQueryBuilder(queryRunner)
      .softDelete()
      .from(MovieEntity)
      .where('movies.id in (:ids) ', {ids})
      .execute();
  }

  async searchMovieByTitleOrDescription(keyword: string) {
    const findQuery = await this.makeQueryBuilder()
      .select('movies.name name')
      .execute();

    if (keyword) {
      findQuery.andWhere(
        new Brackets((qb) => {
          qb.where('movies.title LIKE :keyword', { keyword: `%${keyword}%` });
          qb.orWhere('movies.description LIKE :keyword', { keyword: `%${keyword}%` });
        })
      );
    }

    return findQuery;
  }
}