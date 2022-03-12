import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenreMovieEntity } from '../database/entities/genreMovie.entity';
import { MoviesController } from '../controller/movies/movies.controller';
import { MoviesService } from '../service/movies.service';
import { MovieRepository } from '../database/repository/movie.repository';
import { GenreRepository } from '../database/repository/genre.repository';

@Module({
  imports: [TypeOrmModule.forFeature([GenreRepository, MovieRepository, GenreMovieEntity])],
  providers: [MoviesService],
  exports: [MoviesService],
  controllers: [MoviesController],
})
export class MovieModule {}
