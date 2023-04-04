import {CustomRepository} from "../../shared/typeorm-ex.decorator";
import {QueryRunner, Repository, SelectQueryBuilder} from "typeorm";
import {MovieReviewEntitiy} from "../entities/movieReview/movieReview.entitiy";

@CustomRepository(MovieReviewEntitiy)
export class MovieReviewRepository extends Repository<MovieReviewEntitiy> {
  makeQueryBuilder(queryRunner?: QueryRunner): SelectQueryBuilder<MovieReviewEntitiy> {
    return this.createQueryBuilder('movie_reviews', queryRunner);
  }

  async findReviewListByMovieId(movieId: number, queryRunner?: QueryRunner) {
    return this.makeQueryBuilder(queryRunner)
      .select([
        'movie_reviews.id',
        'movie_reviews.content',
        'movie_reviews.like_counts',
        'movie_reviews.createdAt',
        'movie_reviews.updatedAt',
      ])
      .where('movie_reviews.movie_id = :movie_id', {movie_id: movieId})
      .getMany();
  }
}