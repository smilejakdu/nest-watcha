import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesController } from '../controller/movies/movies.controller';
import { MoviesService } from '../service/movies.service';
import { MovieRepository } from '../database/repository/movie.repository';
import { GenreRepository } from '../database/repository/genre.repository';
import { GenreMovieRepository } from '../database/repository/genreMovie.repository';
import { GenreMovieService } from '../service/genreMovie.service';
import { MovieOptionsController } from '../controller/movies/movieOptions.controller';
import { MovieOptionsRepository } from '../database/repository/movieOptions.repository';
import { MovieOptionsService } from '../service/movieOptions.service';

@Module({
  imports: [TypeOrmModule.forFeature([
                            GenreRepository,
                            MovieRepository,
                            GenreMovieRepository,
                            MovieOptionsRepository])],
  providers: [MoviesService, GenreMovieService, MovieOptionsService],
  exports: [MoviesService],
  controllers: [MoviesController,MovieOptionsController],
})
export class MovieModule {}
