import { Injectable } from '@nestjs/common';
import { CoreResponse } from '../shared/CoreResponse';
import { GenreRepository } from '../database/repository/genre.repository';

@Injectable()
export class GenreService {
  constructor(
    private readonly genreRepository : GenreRepository,
  ) {}

  async findById(id: number): Promise<CoreResponse> {
    return await this.genreRepository.findById(id);
  }

  async findAllGenre(): Promise<CoreResponse> {
    return await this.genreRepository.findAll();
  }

  async findWithMovieById(genreId:number):Promise<CoreResponse>{
    return await this.genreRepository.findWithMovieById(genreId);
  }

  async createGenre(genreName : string):Promise<CoreResponse> {
    return await this.genreRepository.createGenre(genreName);
  }
}