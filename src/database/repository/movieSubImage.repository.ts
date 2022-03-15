import { EntityRepository, QueryRunner, Repository, SelectQueryBuilder } from 'typeorm';
import { subMovieImageEntity } from '../entities/subMovieImage.entity';

@EntityRepository(subMovieImageEntity)
export class MovieSubImageRepository extends Repository<subMovieImageEntity>{
  makeQueryBuilder(queryRunner?: QueryRunner): SelectQueryBuilder<subMovieImageEntity> {
    return this.createQueryBuilder('sub_movie_image', queryRunner);
  }

  async findAll(queryRunner?: QueryRunner) {
    return await this.makeQueryBuilder(queryRunner)
      .where('sub_movie_image.deletedAt is NULL')
      .getMany();
  }

  async findOneById(id:number){
    return await this.makeQueryBuilder()
      .leftJoinAndSelect('sub_movie_image.movie', 'movie','movie.deletedAt is null')
      .andWhere('sub_movie_image.id =:id',{id})
      .getOne();
  }
}