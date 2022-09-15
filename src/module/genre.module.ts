import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenreService } from '../service/genre.service';
import { GenreController } from '../controller/genre/genre.controller';
import { GenreMovieEntity } from '../database/entities/MovieAndGenre/genreMovie.entity';
import { MovieEntity } from '../database/entities/MovieAndGenre/movie.entity';
import { GenreRepository } from '../database/repository/MovieAndGenreRepository/genre.repository';

@Module({
  imports: [TypeOrmModule.forFeature([GenreRepository,GenreMovieEntity,MovieEntity])],
  providers: [GenreService],
  exports: [GenreService],
  controllers: [GenreController],
})
export class GenreModule {}
