import { QueryRunner, Repository, SelectQueryBuilder } from 'typeorm';
import { GenreMovieEntity } from '../../entities/MovieAndGenre/genreMovie.entity';
import { CreateGenreMovieDto } from '../../../controller/movies/genreMovie.controller.dto/createGenreMovie.dto';
import {CustomRepository} from "../../../shared/typeorm-ex.decorator";

@CustomRepository(GenreMovieEntity)
export class GenreMovieRepository extends Repository<GenreMovieEntity>{
  makeQueryBuilder(queryRunner?: QueryRunner): SelectQueryBuilder<GenreMovieEntity> {
    return this.createQueryBuilder('genre_movie', queryRunner);
  }

  async createGenreMovie(createGenreMovieDto : CreateGenreMovieDto){
    const createdGenreMovie =  await this.makeQueryBuilder()
      .insert()
      .values(createGenreMovieDto)
      .execute();
    return createdGenreMovie.raw.insertId;
  }

  async updateGenreMovie(data){
    const {genreId , movieId,id } = data;
    const updatedGenreMovie =  await this.makeQueryBuilder()
      .update()
      .set({
        genreId:genreId,
        movieId:movieId,
      })
      .where('genre_movie.id =:id',{id:id})
      .execute();
    return updatedGenreMovie.raw.insertId;
  }
}