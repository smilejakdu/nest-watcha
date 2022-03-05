import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenreService } from '../database/service/genre.service';
import { GenreController } from '../controller/genre/genre.controller';
import { MovieEntity } from '../database/entities/MovieEntity';
import { GenreMovieEntity } from '../database/entities/GenreMovieEntity';

@Module({
  imports: [TypeOrmModule.forFeature([MovieEntity , GenreMovieEntity])],
  providers: [GenreService],
  exports: [GenreService],
  controllers: [GenreController],
})
export class MovieModule {}
