import { EntityRepository, QueryRunner, Repository, SelectQueryBuilder } from 'typeorm';
import { GenreEntity } from '../entities/genre.entity';
import { UpdateGenreDto } from '../../controller/genre/genre.controller.dto/updateGenre.dto';

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

  async createGenre(name:string) {
    const createdGenre = await this.makeQueryBuilder()
      .insert()
      .values({
        name:name,
      }).execute();
    return createdGenre.raw.insertId;
  }

  async updatedGenre(genreUpdateDto:UpdateGenreDto){
    const {id , name} =genreUpdateDto;
    const updatedGenre = await this.makeQueryBuilder()
      .update(GenreEntity)
      .set({ name : name })
      .where('genre.id =:id',{id : id})
      .execute();
    return updatedGenre.raw.insertId;
  }

  async deletedGenre(genreId:number) {
      const deletedGenre = await this.makeQueryBuilder()
        .softDelete()
        .from(GenreEntity)
        .where('genre.id =:genreId',{genreId:genreId})
        .execute();
      return deletedGenre.raw.insertId;
  }
}
