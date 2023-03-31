import {
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { MovieEntity } from '../../entities/MovieAndGenre/movie.entity';
import { CustomRepository } from "../../../shared/typeorm-ex.decorator";

@CustomRepository(MovieEntity)
export class MovieRepository extends Repository<MovieEntity>{
  makeQueryBuilder(queryRunner?: QueryRunner): SelectQueryBuilder<MovieEntity> {
    return this.createQueryBuilder('movie', queryRunner);
  }

  async findMovieAll(
    pageNumber: number,
    size: number,
    queryRunner?: QueryRunner,
  ) {
    const skip = (pageNumber - 1) * size;
    const foundLikeCountsAvg = await this
      .makeQueryBuilder()
      .select()
      .where('movie.id = :id', {id: 1})
      .getRawOne();

    return this.makeQueryBuilder(queryRunner)
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
      .innerJoin('movie.Genremovie','genremovie')
      .innerJoin('movie.MovieOption','movieOption')
      .innerJoin('genremovie.Genre','genre')
      .leftJoin('movie.subMovieImage','subMovieImage')
      .skip(skip)
      .take(size)
      .getMany();
  }
  async findOneMovieById(id: number, queryRunner?: QueryRunner) {
    const foundOneMovie = await this
      .makeQueryBuilder()
      .select()
      .where('movie.id = :id', {id})
      .getRawOne();
  }

  async deleteMovieByIds(ids: number[], queryRunner?: QueryRunner) {
    return this.makeQueryBuilder(queryRunner)
      .softDelete()
      .from(MovieEntity)
      .where('movie.id in (:ids) ', {ids})
      .execute();
  }
}