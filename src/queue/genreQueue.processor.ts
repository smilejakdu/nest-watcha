import { Process, Processor } from '@nestjs/bull';
import { GenreRepository } from "../database/repository/MovieAndGenreRepository/genre.repository";
import { Job } from "bull";
import { GenreEntity } from "../database/entities/MovieAndGenre/genre.entity";
import { transactionRunner } from "../database/transactionRunner";
import { QueryRunner } from "typeorm";

@Processor('genre-creation-queue')
export class GenreQueueProcessor {
    constructor(private readonly genreRepository: GenreRepository) {}

    @Process('create-genre')
    async handleGenreCreation(job: Job<{ genreNameList: string[] }>) {
        const { genreNameList } = job.data;
        genreNameList.map((genreName) => {
            const newGenre = new GenreEntity();
            newGenre.name = genreName;
            return newGenre;
        });
    }
}
