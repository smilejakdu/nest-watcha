import {CACHE_MANAGER, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CoreResponse, SuccessFulResponse } from '../shared/CoreResponse';
import { GenreRepository } from '../database/repository/MovieAndGenreRepository/genre.repository';
import { transactionRunner } from "../shared/common/transaction/transaction";
import {DataSource, QueryRunner } from "typeorm";
import { GenreEntity } from "../database/entities/MovieAndGenre/genre.entity";
import {CreateGenreResponseDto} from "../controller/genre/genre.controller.dto/createGenre.dto";
import {UpdateGenreResponseDto} from "../controller/genre/genre.controller.dto/updateGenre.dto";
import {DeleteGenreResponseDto} from "../controller/genre/genre.controller.dto/deleteGenre.dto";
import { Cache } from 'cache-manager';

@Injectable()
export class GenreService {
  constructor(
    private readonly genreRepository: GenreRepository,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
    private readonly dataSource: DataSource,
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
    },this.dataSource);

    const createdGenreResponseDto = new CreateGenreResponseDto();
    createdGenreResponseDto.id = createdGenre.id;
    createdGenreResponseDto.genreName = createdGenre.name;

    return SuccessFulResponse(createdGenreResponseDto, HttpStatus.CREATED);
  }

  async findGenreWithMovieByName(genreName: string): Promise<CoreResponse> {
    // genre 와 movie 를 join 하여 가져오는 방법
    const redisGenre = await this.cacheService.get(genreName);
    if (redisGenre) {
      console.log('캐싱이야', redisGenre);
      return SuccessFulResponse(redisGenre);
    }
    const foundGenre = await this.genreRepository.findOne({
      where: { name: genreName },
      relations: ['movies'],
    });

    if (!foundGenre) {
      throw new NotFoundException('does not found genre');
    }

    await this.cacheService.set(
      genreName,
      foundGenre,
      5);

    console.log('캐싱 아니야', redisGenre);

    return SuccessFulResponse(foundGenre);
  }

  async findAllGenre(pageNumber: number, size: number): Promise<CoreResponse> {
    const foundAllGenre = await this.genreRepository.findAllGenre(pageNumber, size);
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
    },this.dataSource);

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