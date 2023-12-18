import {CACHE_MANAGER, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import {CoreResponseDto, SuccessFulResponse} from '../shared/CoreResponse';
import { GenreRepository } from '../database/repository/MovieAndGenreRepository/genre.repository';
import { transactionRunner } from "../shared/common/transaction/transaction";
import {DataSource, In, QueryRunner} from "typeorm";
import { GenreEntity } from "../database/entities/MovieAndGenre/genre.entity";
import {CreateGenreResponseDto} from "../controller/genre/genre.controller.dto/createGenre.dto";
import {UpdateGenreResponseDto} from "../controller/genre/genre.controller.dto/updateGenre.dto";
import {DeleteGenreResponseDto} from "../controller/genre/genre.controller.dto/deleteGenre.dto";
import { Cache } from 'cache-manager';
import {InjectQueue} from "@nestjs/bull";
import {Queue} from "bull";

@Injectable()
export class GenreService {
  constructor(
    private readonly genreRepository: GenreRepository,
    @Inject(CACHE_MANAGER)
    private readonly cacheService: Cache,
    @InjectQueue('genre-creation-queue')
    private readonly genreQueue: Queue,
    private readonly dataSource: DataSource,
  ) {}

  async createGenre(genreName : string) {
    const foundGenre = await this.genreRepository.findOneBy({name: genreName});

    if (foundGenre) {
      throw new NotFoundException('genre already exists');
    }

    const newGenre = new GenreEntity();
    const createdGenre = await transactionRunner<GenreEntity>(async (queryRunner:QueryRunner) => {
      newGenre.name = genreName;
      return await queryRunner.manager.save(GenreEntity, newGenre);
    },this.dataSource);

    const createdGenreResponseDto = new CreateGenreResponseDto();
    createdGenreResponseDto.id = createdGenre.id;
    createdGenreResponseDto.genreName = createdGenre.name;

    return SuccessFulResponse(createdGenreResponseDto, HttpStatus.CREATED);
  }

  async createMultiGenre(genreNameList: string[]) {
    const foundGenreList = await this.genreRepository.find({
        where: {
            name: In(genreNameList),
        },
    });

    const foundGenreNameList = foundGenreList.map((genre) => genre.name);
    const notFoundGenreNameList = genreNameList.filter((genreName) => !foundGenreNameList.includes(genreName));

    const newGenreList = notFoundGenreNameList.map((genreName) => {
        const newGenre = new GenreEntity();
        newGenre.name = genreName;
        return newGenre;
    });

    const createdGenreList = await transactionRunner<GenreEntity[]>(async (queryRunner:QueryRunner) => {
        return await queryRunner.manager.save(GenreEntity, newGenreList);
    },this.dataSource);

    await this.genreQueue.add('create-genre', {
      genreNameList,
    });

    return SuccessFulResponse(createdGenreList, HttpStatus.CREATED);
  }

  async findGenreWithMovieByName(
    genreName: string,
    pageNumber: number,
    size: number,
  ): Promise<CoreResponseDto>
  {
    const redisGenre = await this.cacheService.get(genreName);

    if (redisGenre) {
      console.log('캐싱이야', redisGenre);
      return SuccessFulResponse(redisGenre);
    }

    const foundGenre = await this.genreRepository.find({
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        genreMovie: {
          movie_id: true,
          genre_id: true,
          movie:{
            id: true,
            title : true,
            movie_score : true,
          }
        }
      },
      relations: ['genreMovie', 'genreMovie.Movie'],
      where: { name: genreName },
      order: { createdAt: 'DESC' },
    });

    if (!foundGenre) {
      throw new NotFoundException('does not found genre');
    }

    await this.cacheService.set(
      genreName,
      foundGenre,
      5,
    );

    return SuccessFulResponse(foundGenre);
  }

  async findAllGenre(pageNumber: number, size: number): Promise<CoreResponseDto> {
    const foundAllGenre = await this.genreRepository.findAllGenre(pageNumber, size);
    return SuccessFulResponse(foundAllGenre);
  }

  async updateGenre(genreId:number, genreName:string) {
    const foundGenre = await this.genreRepository.findOneBy({id: genreId});

    if (!foundGenre) {
      throw new NotFoundException('does not found genre');
    }

    const updatedGenre = await transactionRunner<GenreEntity>(async (queryRunner:QueryRunner)=>{
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

    const deletedGenre = await transactionRunner<GenreEntity>(async (queryRunner:QueryRunner) => {
      return await queryRunner.manager.softDelete(GenreEntity, foundGenre);
    });

    const deletedGenreResponseDto = new DeleteGenreResponseDto();
    deletedGenreResponseDto.id = deletedGenre.id
    return SuccessFulResponse(deletedGenre);
  }
}
