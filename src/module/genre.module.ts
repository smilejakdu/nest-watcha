import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenreEntity } from '../database/entities/GenreEntity';
import { GenreService } from '../database/service/genre.service';
import { GenreController } from '../controller/genre/genre.controller';
import { GenreMovieEntity } from '../database/entities/GenreMovieEntity';
import { MovieEntity } from '../database/entities/MovieEntity';

@Module({
  imports: [TypeOrmModule.forFeature([GenreEntity,GenreMovieEntity,MovieEntity])],
  providers: [GenreService],
  exports: [GenreService],
  controllers: [GenreController],
})
export class GenreModule {}
