import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenreMovieEntity } from '../database/entities/genreMovie.entity';
import { MoviesController } from '../controller/movies/movies.controller';
import { MoviesService } from '../service/movies.service';
import { GenreEntity } from '../database/entities/genre.entity';
import { MovieRepository } from '../database/repository/movie.repository';

@Module({
  imports: [TypeOrmModule.forFeature([GenreEntity, MovieRepository, GenreMovieEntity])],
  providers: [MoviesService],
  exports: [MoviesService],
  controllers: [MoviesController],
})
export class MovieModule {}
