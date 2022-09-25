import {
  EntityRepository,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { MovieOptionEntity } from '../../entities/MovieAndGenre/movieOption.entity';

@EntityRepository(MovieOptionEntity)
export class MovieOptionsRepository extends Repository<MovieOptionEntity>{
  makeQueryBuilder(queryRunner?: QueryRunner): SelectQueryBuilder<MovieOptionEntity> {
    return this.createQueryBuilder('movie_option', queryRunner);
  }

  async createMovieOption(data , queryRunner) {
    const newMovieOption = new MovieOptionEntity();
    Object.assign(newMovieOption,data);
    return await queryRunner.manager.save(MovieOptionEntity, newMovieOption);
  }
}