import { EntityRepository, QueryRunner, Repository, SelectQueryBuilder } from 'typeorm';
import { GenreEntity } from '../entities/genre.entity';

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

  async createGenre(genreName:string) {
    const createdGenre = await this.makeQueryBuilder()
      .insert()
      .values({
        genreName:genreName,
      }).execute();
    return createdGenre.raw.insertId;
  }
}
