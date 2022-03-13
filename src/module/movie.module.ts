import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesController } from '../controller/movies/movies.controller';
import { MoviesService } from '../service/movies.service';
import { MovieRepository } from '../database/repository/movie.repository';
import { GenreRepository } from '../database/repository/genre.repository';
import { GenreMovieRepository } from '../database/repository/genreMovie.repository';
import { GenreMovieService } from '../service/genreMovie.service';

@Module({
  imports: [TypeOrmModule.forFeature([GenreRepository, MovieRepository, GenreMovieRepository])],
  providers: [MoviesService,GenreMovieService],
  exports: [MoviesService],
  controllers: [MoviesController],
})
export class MovieModule {}
