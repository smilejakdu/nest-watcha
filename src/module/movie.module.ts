import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieEntity } from '../database/entities/MovieEntity';
import { GenreMovieEntity } from '../database/entities/GenreMovieEntity';
import { MoviesController } from '../controller/movies/movies.controller';
import { MoviesService } from '../database/service/movies.service';
import { GenreEntity } from '../database/entities/GenreEntity';

@Module({
  imports: [TypeOrmModule.forFeature([GenreEntity, MovieEntity, GenreMovieEntity])],
  providers: [MoviesService],
  exports: [MoviesService],
  controllers: [MoviesController],
})
export class MovieModule {}
