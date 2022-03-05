import { HttpStatus, Injectable } from '@nestjs/common';
import { GenreEntity } from '../entities/GenreEntity';
import { CoreResponse } from '../../shared/CoreResponse';

@Injectable()
export class GenreService {

  async findById(id: number): Promise<CoreResponse> {
    const genre = await GenreEntity.findByid(id).getOne();
    return {
      statusCode: HttpStatus.OK,
      message: 'SUCCESS',
      data: genre,
    };
  }

  async findAllGenre(): Promise<CoreResponse> {
    const allGenre = await GenreEntity.findAll();
    return {
      statusCode : HttpStatus.OK,
      message:'SUCCESS',
      data:allGenre,
    };
  }

  async createGenre(genreName : string):Promise<CoreResponse> {
    await GenreEntity.createGenre(genreName);
    return {
      statusCode : HttpStatus.CREATED,
      message : 'SUCCESS',
    };
  }
}