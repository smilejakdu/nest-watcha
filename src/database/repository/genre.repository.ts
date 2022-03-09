import { EntityRepository, QueryRunner, Repository, SelectQueryBuilder } from 'typeorm';
import { GenreEntity } from '../entities/GenreEntity';
import { isNil } from 'lodash';
import { CoreResponse } from '../../shared/CoreResponse';
import { HttpStatus } from '@nestjs/common';
import { GenreMovieEntity } from '../entities/GenreMovieEntity';
import { MovieEntity } from '../entities/MovieEntity';

@EntityRepository(GenreEntity)
export class GenreRepository extends Repository<GenreEntity> {
  makeQueryBuilder(queryRunner?: QueryRunner): SelectQueryBuilder<GenreEntity> {
    return this.createQueryBuilder('genre', queryRunner);
  }

  async findAll():Promise<CoreResponse>{
    const genre = await this.makeQueryBuilder()
      .where('genre.deletedAt is NULL')
      .getMany();
    if (isNil(genre)){
      return {
        ok : false,
        statusCode : HttpStatus.NOT_FOUND,
        message: 'NOT_FOUND_GENRE',
      };
    }
    return{
      ok : true,
      statusCode : HttpStatus.OK,
      message: 'SUCCESS',
      data:genre,
    };
  }

  async findById(id:number):Promise<CoreResponse>{
    const genre = await this.makeQueryBuilder()
      .where('genre.id=:id ', {id:id})
      .getOne();

    if (isNil(genre)){
      return {
        ok : false,
        statusCode : HttpStatus.NOT_FOUND,
        message: 'NOT_FOUND_GENRE',
      };
    }
    return{
      ok : true,
      statusCode : HttpStatus.OK,
      message: 'SUCCESS',
      data:genre,
    };
  }

  async findWithMovieById(genreId:number):Promise<CoreResponse>{
    const foundGenreWithMovies = await this.makeQueryBuilder()
      .leftJoinAndSelect(GenreMovieEntity,'genreMovie')
      .leftJoinAndSelect(MovieEntity ,'movie')
      .where('genre.id=:id ', {id:genreId})
      .andWhere('genre.deletedAt is NULL');

      if (isNil(foundGenreWithMovies)) {
        return {
          ok : false,
          statusCode : HttpStatus.NOT_FOUND,
          message: 'NOT_FOUND_GENRE',
        };
      }

      return {
        ok:true,
        statusCode : HttpStatus.OK,
        message: 'SUCCESS',
        data:foundGenreWithMovies
    };
  }

  async createGenre(genreName:string):Promise<CoreResponse>{
    await this.makeQueryBuilder()
      .insert()
      .values({
        genreName:genreName,
      }).execute();
    return {
      ok:true,
      statusCode:HttpStatus.CREATED,
      message:'SUCCESS',
    };
  }
}
