import { EntityRepository, QueryRunner, Repository, SelectQueryBuilder } from 'typeorm';
import { MovieEntity } from '../entities/movie.entity';
import { CreateMovieDto } from '../../controller/movies/movie.controller.dto/createMovie.dto';

@EntityRepository(MovieEntity)
export class MovieRepository extends Repository<MovieEntity>{
  makeQueryBuilder(queryRunner?: QueryRunner): SelectQueryBuilder<MovieEntity> {
    return this.createQueryBuilder('movie', queryRunner);
  }

  async createMovie(createMovieDto:CreateMovieDto) {
    return await this.makeQueryBuilder()
      .insert()
      .values(createMovieDto)
      .execute();
  }

  findAll(queryRunner?: QueryRunner) {
    return this.makeQueryBuilder(queryRunner)
      .addSelect([
        'genre.id',
        'genre.name'
      ])
      .addSelect([
        'subMovieImage.id',
        'subMovieImage.imageString',
        'subMovieImage.updatedAt',
      ])
      .addSelect([
        'subMovieImage.id',
        'subMovieImage.imageString',
        'subMovieImage.updatedAt',
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
      .leftJoin('movie.subMovieImage','subMovieImage');
  }

  findOneById(id:number) {
    return this.makeQueryBuilder()
      .leftJoinAndSelect('movie.subImage','subImage')
      .where('movie.id=:id ', {id:id})
      .andWhere('movie.deletedAt is null');
  }

  updateMovieByIds(ids: number[], set: any, queryRunner?: QueryRunner) {
    return this.makeQueryBuilder(queryRunner)
      .update(MovieEntity)
      .set(set)
      .where('movies.id in (:ids)', { ids })
      .execute();
  }

  deleteMovieByIds(ids: number[], queryRunner?: QueryRunner) {
    return this.makeQueryBuilder(queryRunner)
      .softDelete()
      .from(MovieEntity)
      .where('movie.id in (:ids) ', {ids})
      .execute();
  }
}