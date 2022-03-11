import { HttpStatus, Injectable } from '@nestjs/common';
import { MovieEntity } from '../database/entities/MovieEntity';
import { isNil } from 'lodash';
import { CoreResponse } from '../shared/CoreResponse';

@Injectable()
export class MoviesService{

  async findById(id:number): Promise<CoreResponse>{
    const movie = await MovieEntity.findByid(id).getOne();
    if(isNil(movie)){
      return {
        ok:false,
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'BAD_REQUEST',
        data: [],
      };
    }
    return {
      ok:true,
      statusCode: HttpStatus.OK,
      message: 'SUCCESS',
      data: movie,
    };
  }

  async createMovie(createMovieDto) {
    const result = await MovieEntity.makeQueryBuilder()
      .insert()
      .values(createMovieDto)
      .execute();
    return {
      movieId: result.raw.insertId
    };
  }
}















