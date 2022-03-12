import { EntityRepository, QueryRunner, Repository, SelectQueryBuilder } from 'typeorm';
import { GenreMovieEntity } from '../entities/genreMovie.entity';

@EntityRepository(GenreMovieEntity)
export class GenreMovieRepository extends Repository<GenreMovieEntity>{
  makeQueryBuilder(queryRunner?: QueryRunner): SelectQueryBuilder<GenreMovieEntity> {
    return this.createQueryBuilder('genre_movie', queryRunner);
  }

  // async createdGenreMovie(){
  //   return await this.makeQueryBuilder()
  //     .where('genre_movie.movieId =:movieId',{})
  //     .andWhere('genre_movie.deletedAt is NULL')
  //     .getMany();
  // }
}