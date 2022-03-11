import { QueryRunner, Repository, SelectQueryBuilder } from 'typeorm';
import { MovieEntity } from '../entities/MovieEntity';
import { CreateMovieDto } from '../../controller/movies/movie.controller.dto/createMovie.dto';

export class MovieRepository extends Repository<MovieEntity>{

  makeQueryBuilder(queryRunner?: QueryRunner): SelectQueryBuilder<MovieEntity> {
    return this.createQueryBuilder('movie', queryRunner);
  }

  async createMovie(createMovieDto:CreateMovieDto) {
    const createdMovie = await this.makeQueryBuilder()
      .insert()
      .values(createMovieDto).execute();
    return createdMovie.raw.insertId;
  }

  async findById(id:number){
    return await this.makeQueryBuilder()
      .where('movie.id=:id ', {id:id})
      .andWhere('movie.deletedAt is null')
      .getOne();
  }

  async updateMovieByIds(ids: number[], set: any, queryRunner?: QueryRunner) {
    return await this.makeQueryBuilder(queryRunner)
      .update(MovieEntity)
      .set(set)
      .where('movie.id in (:ids)', { ids })
      .execute();
  }

  async deleteMovieByIds(ids: number[], queryRunner?: QueryRunner) {
    return this.makeQueryBuilder(queryRunner)
      .softDelete()
      .from(MovieEntity)
      .where('movie.id in (:ids) ', {ids})
      .execute();
  }
}