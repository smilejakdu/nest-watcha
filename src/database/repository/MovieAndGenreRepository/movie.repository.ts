import {
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { MovieEntity } from '../../entities/MovieAndGenre/movie.entity';
import { CreateMovieRequestDto } from '../../../controller/movies/movie.controller.dto/createMovie.dto';
import {CustomRepository} from "../../../shared/typeorm-ex.decorator";

@CustomRepository(MovieEntity)
export class MovieRepository extends Repository<MovieEntity>{
  makeQueryBuilder(queryRunner?: QueryRunner): SelectQueryBuilder<MovieEntity> {
    return this.createQueryBuilder('movie', queryRunner);
  }

  async createMovie(createMovieRequestDto: CreateMovieRequestDto) {
    const newMovie = new MovieEntity();
    Object.assign(newMovie, createMovieRequestDto);
    const createdMovie = await this.makeQueryBuilder()
      .insert()
      .values(newMovie)
      .execute();

    return createdMovie.raw.insertId;
  }

  findAll(
    pageNumber: number,
    queryRunner?: QueryRunner,
  ) {
    const take = 10;
    const skip = (pageNumber - 1) * take;

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
      .take(take)
      .getMany();
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