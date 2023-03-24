import { QueryRunner, Repository, SelectQueryBuilder } from 'typeorm';
import { GenreEntity } from '../../entities/MovieAndGenre/genre.entity';
import { transactionRunner } from '../../../shared/common/transaction/transaction';
import {CustomRepository} from "../../../shared/typeorm-ex.decorator";

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

    return this.makeQueryBuilder()
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
