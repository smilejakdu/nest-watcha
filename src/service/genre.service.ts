import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { BadRequest, CoreResponse, NotFoundResponse, SuccessFulResponse } from '../shared/CoreResponse';
import { GenreRepository } from '../database/repository/MovieAndGenreRepository/genre.repository';
import {transactionRunner} from "../shared/common/transaction/transaction";
import {QueryRunner} from "typeorm";
import {GenreEntity} from "../database/entities/MovieAndGenre/genre.entity";

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

  async updateGenre(genreId:number, genreName:string) {
    const foundGenre = await this.genreRepository.findOneBy({id: genreId});

    if (!foundGenre) {
      throw new NotFoundException('does not found genre');
    }

    const updatedGenre = await transactionRunner(async (queryRunner:QueryRunner)=>{
      foundGenre.name = genreName;
      return await queryRunner.manager.save(GenreEntity, foundGenre);
    });

    return SuccessFulResponse(updatedGenre);
  }

  async deletedGenre(genreId:number) {
    const deletedGenre = await this.genreRepository.deletedGenre(genreId);
    if (!deletedGenre) {
      return NotFoundResponse(deletedGenre);
    }
    return SuccessFulResponse(deletedGenre);
  }
}