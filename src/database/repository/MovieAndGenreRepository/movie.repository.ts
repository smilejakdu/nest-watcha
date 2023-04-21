import {
  Brackets,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { MovieEntity } from '../../entities/MovieAndGenre/movie.entity';
import { CustomRepository } from "../../../shared/typeorm-ex.decorator";
import {GetMovieListDto} from "../../../controller/movies/movie.controller.dto/getMovie.dto";

@CustomRepository(MovieEntity)
export class MovieRepository extends Repository<MovieEntity>{
  makeQueryBuilder(queryRunner?: QueryRunner): SelectQueryBuilder<MovieEntity> {
    return this.createQueryBuilder('movies', queryRunner);
  }

  async findMovieAll(
    pageNumber: number,
    size: number,
    query: GetMovieListDto,
    queryRunner?: QueryRunner,
  ) {
    const skip = (pageNumber - 1) * size;
    const { movie_keyword, director, appearance } = query;
    const findQuery = await this.makeQueryBuilder(queryRunner)
      .addSelect([
        'genre.id',
        'genre.name'
      ])
      .addSelect([
        'subMovieImage.id',
        'subMovieImage.imageString',
        'subMovieImage.createdAt',
      ])
      .addSelect([
        'movieOption.price'
      ])
      .addSelect([
        'genremovie.id'
      ])
      .innerJoin('movies.Genremovie','genremovie')
      .innerJoin('movies.MovieOption','movieOption')
      .innerJoin('genremovie.Genre','genre')
      .leftJoin('movie.subMovieImage','subMovieImage')

    if (movie_keyword) {
      findQuery.andWhere(
        new Brackets((qb) => {
          qb.where('movies.title LIKE :keyword', { keyword: `%${movie_keyword}%` });
          qb.orWhere('movies.description LIKE :keyword', { keyword: `%${movie_keyword}%` });
        })
      );
    }

    return findQuery
      .offset(skip)
      .limit(size)
      .getRawMany();
  }

  async findOneMovieAndReviewAvgById(media_id: number, queryRunner?: QueryRunner) {
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