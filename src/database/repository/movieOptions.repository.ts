import {
  EntityManager,
  EntityRepository,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
  TransactionManager
} from 'typeorm';
import { MovieOptionEntity } from '../entities/movieOption.entity';

@EntityRepository(MovieOptionEntity)
export class MovieOptionsRepository extends Repository<MovieOptionEntity>{
  makeQueryBuilder(queryRunner?: QueryRunner): SelectQueryBuilder<MovieOptionEntity> {
    return this.createQueryBuilder('movie_option', queryRunner);
  }

  async createMovieOption(data , @TransactionManager() transactionManager:EntityManager) {
    const newMovieOption = new MovieOptionEntity();
    Object.assign(newMovieOption,data);
    return await transactionManager.save(MovieOptionEntity, newMovieOption);
  }
}