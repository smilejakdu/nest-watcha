import { HttpStatus, Injectable } from '@nestjs/common';
import { CoreResponse } from '../shared/CoreResponse';
import { GenreRepository } from '../database/repository/genre.repository';
import { isNil } from 'lodash';

@Injectable()
export class GenreService {
  constructor(
    private readonly genreRepository: GenreRepository,
  ) {}

  async createGenre(genreName : string){
    const createdGenre:number = await this.genreRepository.createGenre(genreName);
    return {
      ok : !isNil(createdGenre),
      statusCode :!isNil(createdGenre) ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST,
      message: !isNil(createdGenre) ?'SUCCESS': 'BAD_REQUEST',
      data:!isNil(createdGenre) ? createdGenre : null,
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
    const foundUpdatedGenre = await this.genreRepository.updatedGenre(data);
    return {
      ok : !isNil(foundUpdatedGenre),
      statusCode :!isNil(foundUpdatedGenre) ? HttpStatus.OK : HttpStatus.BAD_REQUEST,
      message: !isNil(foundUpdatedGenre) ?'SUCCESS': 'BAD_REQUEST',
      data:!isNil(foundUpdatedGenre) ? foundUpdatedGenre : null,
    };
  }

  async deletedGenre(genreId:number){
    const foundDeletedGenre = await this.genreRepository.deletedGenre(genreId);
    return {
      ok : !isNil(foundDeletedGenre),
      statusCode :!isNil(foundDeletedGenre) ? HttpStatus.OK : HttpStatus.BAD_REQUEST,
      message: !isNil(foundDeletedGenre) ?'SUCCESS': 'BAD_REQUEST',
      data:!isNil(foundDeletedGenre) ? foundDeletedGenre : null,
    };
  }
}