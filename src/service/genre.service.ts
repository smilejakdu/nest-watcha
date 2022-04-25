import { HttpStatus, Injectable } from '@nestjs/common';
import { CoreResponse } from '../shared/CoreResponse';
import { GenreRepository } from '../database/repository/genre.repository';
import { getConnection } from 'typeorm';

@Injectable()
export class GenreService {
  constructor(
    private readonly genreRepository: GenreRepository,
  ) {}

  async createGenre(genreName : string){
    const queryRunner = await getConnection().createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    let createdGenre;
    try{
      createdGenre = await this.genreRepository.createGenre(genreName,queryRunner);
      await queryRunner.commitTransaction();

      if (createdGenre){
        return {
          ok : true,
          statusCode : HttpStatus.CREATED,
          message: 'CREATED',
          data: createdGenre ,
        };
      }
    }catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
    }finally {
      await queryRunner.release();
    }

    return {
      ok : false,
      statusCode : HttpStatus.BAD_REQUEST,
      message: 'BAD_REQUEST',
    };
  }

  async findById(id: number): Promise<CoreResponse> {
    const foundGenre = await this.genreRepository.findById(id);
    return {
      ok : true,
      statusCode : HttpStatus.OK,
      message: 'SUCCESS',
      data:foundGenre ,
    };
  }

  async findAllGenre(): Promise<CoreResponse> {
    const foundAllGenre =  await this.genreRepository.findAll();
    return {
      ok : true,
      statusCode : HttpStatus.OK,
      message: 'SUCCESS',
      data: foundAllGenre,
    };
  }

  async updateGenre(data) {
    const queryRunner = await getConnection().createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    let updatedGenre;
    try{
      updatedGenre = await this.genreRepository.updatedGenre(data);
      await queryRunner.commitTransaction();
      if (updatedGenre){
        return {
          ok : true,
          statusCode : HttpStatus.OK,
          message : 'SUCCESS',
          data : updatedGenre,
        };
      }
    }catch (error) {
      await queryRunner.rollbackTransaction();
    }finally {
      await queryRunner.release();
    }

    return {
      ok : false,
      statusCode : HttpStatus.BAD_REQUEST,
      message : 'BAD_REQUEST',
    };
  }

  async deletedGenre(genreId:number){
    const deletedGenre = await this.genreRepository.deletedGenre(genreId);
    if (deletedGenre) {
      return {
        ok : true,
        statusCode : HttpStatus.OK,
        message: 'SUCCESS',
        data:deletedGenre,
      };
    }
    return {
      ok : false,
      statusCode :HttpStatus.BAD_REQUEST,
      message: 'BAD_REQUEST',
    };
  }
}