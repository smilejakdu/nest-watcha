import { QueryRunner, Repository, SelectQueryBuilder } from 'typeorm';
import { GenreEntity } from '../../entities/MovieAndGenre/genre.entity';
import { transactionRunner } from '../../../shared/common/transaction/transaction';
import {CustomRepository} from "../../../shared/typeorm-ex.decorator";

@CustomRepository(GenreEntity)
export class GenreRepository extends Repository<GenreEntity> {
  makeQueryBuilder(queryRunner?: QueryRunner): SelectQueryBuilder<GenreEntity> {
    return this.createQueryBuilder('genre', queryRunner);
  }

  async findAllGenre(pageNumber: number) {
    const take = 10;
    const skip = (pageNumber - 1) * take;

    return this.makeQueryBuilder()
      .where('genre.deletedAt is NULL')
      .limit(take)
      .offset(skip)
      .getRawMany();
  }

  async findById(id: number) {
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
      .where('genre.id=:id ', { id: id })
      .getOne();
  }

  async createGenre(name: string) {
    const newGenre = new GenreEntity();
    newGenre.name = name;
    const createdGenre = await transactionRunner(async (queryRunner:QueryRunner) => {
      return await queryRunner.manager.save(GenreEntity,newGenre);
    });
    return createdGenre.id;
  }

  async deletedGenre(genreId:number) {
    const foundGenre = await this.findOneBy({id: genreId});
    if (!foundGenre) {
      throw new Error('Genre not found');
    }
    const deletedGenre = await transactionRunner(async (queryRunner:QueryRunner) => {
      return await queryRunner.manager.softDelete(GenreEntity, foundGenre.id);
    });
    return deletedGenre.affected;
  }
}
