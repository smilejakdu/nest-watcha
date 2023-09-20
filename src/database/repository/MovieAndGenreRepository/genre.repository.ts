import { QueryRunner, Repository, SelectQueryBuilder } from 'typeorm';
import { GenreEntity } from '../../entities/MovieAndGenre/genre.entity';
import {CustomRepository} from "../../../shared/typeorm/typeorm-ex.decorator";

export interface GenreWithMovies {
  genre_id: number;
  genre_name: string;
  movies: Movie[];
}

interface Movie {
  id: number;
  title: string;
  description: string;
  movie_score: number;
  price: number;
  movie_image: string;
  director: string;
  appearance: string;
  age_limit_status: string;
}

@CustomRepository(GenreEntity)
export class GenreRepository extends Repository<GenreEntity> {
  makeQueryBuilder(queryRunner?: QueryRunner): SelectQueryBuilder<GenreEntity> {
    return this.createQueryBuilder('genre', queryRunner);
  }

  async findAllGenre(
    pageNumber: number,
    size: number,
  ) {
    const skip = (pageNumber - 1) * size;

    // 밑에 return 타입 interface 를 만들어줘
    return this.makeQueryBuilder()
      .select([
        'genre.id',
        'genre.name',
      ])
      .innerJoin('genre.Genremovie', 'Genremovie')
      .limit(size)
      .offset(skip)
      .getRawMany();
  }

  async findOneByIdWithMovie(genreId: number) {
    return this.makeQueryBuilder()
      .select([
        'genre.id',
        'genre.name',
      ])
      .addSelect([
        'movie.id',
        'movie.name',
        'movie.description',
        'movie.image',
      ])
      .leftJoin('genre.Genremovie', 'movies')
      .where('genre.id=:genreId ', { genreId })
      .getOne();
  }
}
