import { HttpStatus, Injectable } from '@nestjs/common';
import { MovieEntity } from '../entities/MovieEntity';
import { isNil } from 'lodash';
import { CoreResponse } from '../../shared/CoreResponse';
import { createMovieDto } from '../../controller/movies/movie.controller.dto/createMovie.dto';

@Injectable()
export class MoviesService{

  async findById(id:number): Promise<CoreResponse>{
    const movie = await MovieEntity.findByid(id).getOne();
    if(isNil(movie)){
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'BAD_REQUEST',
        data: [],
      };
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'SUCCESS',
      data: movie,
    };
  }

  async createMovie(createMovieDto : createMovieDto) {
    await MovieEntity.createMovie(createMovieDto);
    return {
      statusCode : HttpStatus.CREATED,
      message : 'SUCCESS',
    };
  }
}