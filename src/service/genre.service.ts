import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { BadRequest, CoreResponse, NotFoundResponse, SuccessFulResponse } from '../shared/CoreResponse';
import { GenreRepository } from '../database/repository/MovieAndGenreRepository/genre.repository';

@Injectable()
export class GenreService {
  constructor(
    private readonly genreRepository: GenreRepository,
  ) {}

  async createGenre(genreName : string) {
      const createdGenre = await this.genreRepository.createGenre(genreName);

      if (!createdGenre) {
        throw new NotFoundException('does not found');
      }

      return SuccessFulResponse(createdGenre,HttpStatus.CREATED);
  }

  async findGenreWithMovieById(id: number): Promise<CoreResponse> {
    const foundGenre = await this.genreRepository.findById(id);
    return SuccessFulResponse(foundGenre);
  }

  async findAllGenre(): Promise<CoreResponse> {
    const foundAllGenre =  await this.genreRepository.findAll();
    return SuccessFulResponse(foundAllGenre);
  }

  async updateGenre(data) {
      const updatedGenre = await this.genreRepository.updatedGenre(data);

      if (updatedGenre){
        return SuccessFulResponse(updatedGenre);
      }
      return BadRequest();
  }

  async deletedGenre(genreId:number) {
    const deletedGenre = await this.genreRepository.deletedGenre(genreId);
    if (!deletedGenre) {
      return NotFoundResponse(deletedGenre);
    }
    return SuccessFulResponse(deletedGenre);
  }
}