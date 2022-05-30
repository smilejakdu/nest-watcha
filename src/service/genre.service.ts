import { Injectable, NotFoundException } from '@nestjs/common';
import {
  BadRequest,
  CoreResponse,
  CreateSuccessFulResponse,
  NotFoundResponse,
  SuccessResponse
} from '../shared/CoreResponse';
import { GenreRepository } from '../database/repository/genre.repository';

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
      return CreateSuccessFulResponse(createdGenre);
  }

  async findById(id: number): Promise<CoreResponse> {
    const foundGenre = await this.genreRepository.findById(id);
    return SuccessResponse(foundGenre);
  }

  async findAllGenre(): Promise<CoreResponse> {
    const foundAllGenre =  await this.genreRepository.findAll();
    return SuccessResponse(foundAllGenre);
  }

  async updateGenre(data) {
      const updatedGenre = await this.genreRepository.updatedGenre(data);

      if (updatedGenre){
        return SuccessResponse(updatedGenre);
      }
      return BadRequest();
  }

  async deletedGenre(genreId:number) {
    const deletedGenre = await this.genreRepository.deletedGenre(genreId);
    if (!deletedGenre) {
      return NotFoundResponse(deletedGenre);
    }
    return SuccessResponse(deletedGenre);
  }
}