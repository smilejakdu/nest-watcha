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

  async findAll(queryRunner?: QueryRunner) {
    return await this.makeQueryBuilder(queryRunner)
      .where('movie.deletedAt is NULL')
      .getMany();
  }

  async findOneById(id:number){
    return await this.makeQueryBuilder()
      .where('movie.id=:id ', {id:id})
      .andWhere('movie.deletedAt is null')
      .getOne();
  }

  async updateMovieByIds(ids: number[], set: any, queryRunner?: QueryRunner) {
    console.log(ids);
    console.log(set);
    const updatedMovie =  await this.makeQueryBuilder(queryRunner)
      .update(MovieEntity)
      .set(set)
      .where('movies.id in (:ids)', { ids })
      .execute();
    console.log('updatedMovie:',updatedMovie);
    return updatedMovie.raw.insertId;
  }

  async deleteMovieByIds(ids: number[], queryRunner?: QueryRunner) {
    const deletedMovie = await this.makeQueryBuilder(queryRunner)
      .softDelete()
      .from(MovieEntity)
      .where('movie.id in (:ids) ', {ids})
      .execute();
    return deletedMovie.raw.insertId;
  }
}