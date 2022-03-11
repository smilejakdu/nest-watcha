import { EntityRepository, QueryRunner, Repository, SelectQueryBuilder } from 'typeorm';
import { GenreEntity } from '../entities/GenreEntity';
import { GenreMovieEntity } from '../entities/GenreMovieEntity';

@EntityRepository(GenreEntity)
export class GenreRepository extends Repository<GenreEntity> {
  makeQueryBuilder(queryRunner?: QueryRunner): SelectQueryBuilder<GenreEntity> {
    return this.createQueryBuilder('genre', queryRunner);
  }

  async findAll() {
    return await this.makeQueryBuilder()
      .where('genre.deletedAt is NULL')
      .getMany();
  }

  async findById(id:number){
    return await this.makeQueryBuilder()
      .leftJoinAndSelect('genre.Genremovie','movies')
      .where('genre.id=:id ', {id:id})
      .andWhere('genre.deletedAt is null')
      .getOne();
  }

  async findWithMovieById(genreId:number) {
    return await this.makeQueryBuilder()
      .leftJoinAndSelect(GenreMovieEntity,'genreMovie')
      .where('genre.id=:id ', {id:genreId})
      .andWhere('genre.deletedAt is NULL')
      .getOne();
  }

  async createGenre(genreName:string) {
    const createdGenre = await this.makeQueryBuilder()
      .insert()
      .values({
        genreName:genreName,
      }).execute();
    return createdGenre.raw.insertId;
  }
}
