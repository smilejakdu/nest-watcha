import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CoreResponse, SuccessFulResponse } from '../shared/CoreResponse';
import { GenreRepository } from '../database/repository/MovieAndGenreRepository/genre.repository';
import { transactionRunner } from "../shared/common/transaction/transaction";
import { QueryRunner } from "typeorm";
import { GenreEntity } from "../database/entities/MovieAndGenre/genre.entity";
import {CreateGenreResponseDto} from "../controller/genre/genre.controller.dto/createGenre.dto";
import {UpdateGenreResponseDto} from "../controller/genre/genre.controller.dto/updateGenre.dto";
import {DeleteGenreResponseDto} from "../controller/genre/genre.controller.dto/deleteGenre.dto";

@Injectable()
export class GenreService {
  constructor(
    private readonly genreRepository: GenreRepository,
  ) {}

  async createGenre(genreName : string) {
    const foundGenre = await this.genreRepository.findOneBy({name: genreName});

    if (foundGenre) {
      throw new NotFoundException('genre already exists');
    }

    const newGenre = new GenreEntity();
    const createdGenre = await transactionRunner(async (queryRunner:QueryRunner) => {
      newGenre.name = genreName;
      return await queryRunner.manager.save(GenreEntity, newGenre);
    })

    const createdGenreResponseDto = new CreateGenreResponseDto();
    createdGenreResponseDto.id = createdGenre.id;
    createdGenreResponseDto.genreName = createdGenre.name;

    return SuccessFulResponse(createdGenreResponseDto, HttpStatus.CREATED);
  }

  async findGenreWithMovieById(id: number): Promise<CoreResponse> {
    const foundGenre = await this.genreRepository.findById(id);
    return SuccessFulResponse(foundGenre);
  }

  async findAllGenre(pageNumber: number): Promise<CoreResponse> {
    const foundAllGenre = await this.genreRepository.findAllGenre(pageNumber || 1);
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

    const updatedGenreResponseDto = new UpdateGenreResponseDto();
    updatedGenreResponseDto.id = updatedGenre.id;
    updatedGenreResponseDto.genreName = updatedGenre.name;

    return SuccessFulResponse(updatedGenreResponseDto);
  }

  async deletedGenre(genreId: number) {
    const foundGenre = await this.genreRepository.findOneBy({id: genreId});

    if (!foundGenre) {
      throw new NotFoundException('does not found genre');
    }

    const deletedGenre = await transactionRunner(async (queryRunner:QueryRunner) => {
      return await queryRunner.manager.softDelete(GenreEntity, foundGenre);
    });

    const deletedGenreResponseDto = new DeleteGenreResponseDto();
    deletedGenreResponseDto.id = deletedGenre.raw.id;
    return SuccessFulResponse(deletedGenre);
  }
}