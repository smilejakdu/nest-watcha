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
    const foundGenre = await this.findById(id);
    const updatedGenre = await transactionRunner(async (queryRunner:QueryRunner)=>{
      foundGenre.name = name;
      return await queryRunner.manager.save(GenreEntity,foundGenre);
    });
    return updatedGenre.id;
  }

  async deletedGenre(genreId:number) {
    const foundGenre = await this.findById(genreId);
    const deletedGenre = await transactionRunner(async (queryRunner:QueryRunner) => {
      return await queryRunner.manager.softDelete(GenreEntity,foundGenre.id);
    });
    return deletedGenre.affected;
  }
}
