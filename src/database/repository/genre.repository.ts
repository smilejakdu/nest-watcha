import { EntityRepository, QueryRunner, Repository, SelectQueryBuilder } from 'typeorm';
import { GenreEntity } from '../entities/genre.entity';
import { transactionRunner } from '../../shared/common/transaction/transaction';

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

  async findById(id: number) {
    return await this.makeQueryBuilder()
      .leftJoinAndSelect('genre.Genremovie', 'movies')
      .where('genre.id=:id ', { id: id })
      .andWhere('genre.deletedAt is null')
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

  async updatedGenre(data){
    const {id , name} = data;
    const updatedGenre = await transactionRunner(async (queryRunner:QueryRunner)=>{
      return await this.makeQueryBuilder()
        .update(GenreEntity)
        .set({name:name})
        .where('genre.id =:id',{id : id})
        .execute();
    });
    return updatedGenre.raw.insertId;
  }

  async deletedGenre(genreId:number) {
    const deletedGenre = await transactionRunner(async (queryRunner:QueryRunner) => {
      return await this.makeQueryBuilder()
        .softDelete()
        .from(GenreEntity)
        .where('genre.id =:genreId',{genreId:genreId})
        .execute();
    });
      return deletedGenre.raw.insertId;
  }
}
