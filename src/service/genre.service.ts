import { HttpStatus, Injectable } from '@nestjs/common';
import { CoreResponse } from '../shared/CoreResponse';
import { GenreRepository } from '../database/repository/genre.repository';

@Injectable()
export class GenreService {
  constructor(
    private readonly genreRepository: GenreRepository,
  ) {}

  async createGenre(genreName : string) {
      const createdGenre = await this.genreRepository.createGenre(genreName);

      if (!createdGenre) {
        return {
          ok: false,
          statusCode: HttpStatus.NOT_FOUND,
          message: 'NOT_FOUND',
        };
      }

      return {
        ok: true,
        statusCode: HttpStatus.CREATED,
        message: 'CREATED',
        data: createdGenre,
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
      const updatedGenre = await this.genreRepository.updatedGenre(data);

      if (updatedGenre){
        return {
          ok : true,
          statusCode : HttpStatus.OK,
          message : 'SUCCESS',
          data : updatedGenre,
        };
      }

    return {
      ok : false,
      statusCode : HttpStatus.BAD_REQUEST,
      message : 'BAD_REQUEST',
    };
  }

  async deletedGenre(genreId:number) {
    const deletedGenre = await this.genreRepository.deletedGenre(genreId);
    if (!deletedGenre) {
      return {
        ok : false,
        statusCode : HttpStatus.NOT_FOUND,
        message: 'NOT_FOUND',
      };
    }
    return {
      ok : true,
      statusCode :HttpStatus.OK,
      message: 'SUCCESS',
      data:deletedGenre,
    };
  }
}