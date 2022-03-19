import { EntityRepository, QueryRunner, Repository, SelectQueryBuilder } from 'typeorm';
import { MovieEntity } from '../entities/movie.entity';
import { CreateMovieDto } from '../../controller/movies/movie.controller.dto/createMovie.dto';

@EntityRepository(MovieEntity)
export class MovieRepository extends Repository<MovieEntity>{
  makeQueryBuilder(queryRunner?: QueryRunner): SelectQueryBuilder<MovieEntity> {
    return this.createQueryBuilder('movie', queryRunner);
  }

  async createMovie(createMovieDto:CreateMovieDto):Promise<number> {
    const createdMovie = await this.makeQueryBuilder()
      .insert()
      .values(createMovieDto)
      .execute();
    return createdMovie.raw.insertId;
  }

  findAll(queryRunner?: QueryRunner) {
    return this.makeQueryBuilder(queryRunner)
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
        'genremovie.id'
      ])
      .innerJoin('movie.Genremovie','genremovie')
      .innerJoinAndSelect('genremovie.Genre','genre')
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