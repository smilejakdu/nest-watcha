import { Module } from '@nestjs/common';
import { MoviesController } from '../controller/movies/movies.controller';
import {MovieMapper, MoviesService} from '../service/movies.service';
import { MovieRepository } from '../database/repository/MovieAndGenreRepository/movie.repository';
import { GenreMovieRepository } from '../database/repository/MovieAndGenreRepository/genreMovie.repository';
import { GenreMovieService } from '../service/genreMovie.service';
import { MovieOptionsController } from '../controller/movies/movieOptions.controller';
import { MovieOptionsRepository } from '../database/repository/MovieAndGenreRepository/movieOptions.repository';
import { MovieOptionsService } from '../service/movieOptions.service';
import {TypeOrmExModule} from "../shared/typeorm-ex.module";

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      MovieRepository,
      GenreMovieRepository,
      MovieOptionsRepository,
    ]),
  ],
  providers: [MoviesService, GenreMovieService, MovieOptionsService, MovieMapper],
  controllers: [MoviesController, MovieOptionsController],
  exports: [MoviesService],
})
export class MovieModule {}
