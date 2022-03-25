import { HttpStatus, Injectable } from '@nestjs/common';
import { MovieOptionsRepository } from '../database/repository/movieOptions.repository';
import { getConnection } from 'typeorm';

@Injectable()
export class MovieOptionsService {
  constructor(
    private readonly movieOptionRepository :MovieOptionsRepository
  ) {}

  async createMovieOption(createMovieOption) {
    const queryRunner = await getConnection().createQueryRunner();
    await queryRunner.startTransaction();

    let createdMovieOption;
    try{
      createdMovieOption = await this.movieOptionRepository.createMovieOption(createMovieOption, queryRunner.manager);
      await queryRunner.commitTransaction();
    }catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    return {
      ok: true ,
      statusCode: HttpStatus.CREATED,
      message: 'SUCCESS',
      data: createdMovieOption,
    };
  }
}