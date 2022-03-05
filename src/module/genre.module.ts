import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenreEntity } from '../database/entities/GenreEntity';
import { GenreService } from '../database/service/genre.service';
import { GenreController } from '../controller/genre/genre.controller';
import { GenreMovieEntity } from '../database/entities/GenreMovieEntity';

@Module({
  imports: [TypeOrmModule.forFeature([GenreEntity,GenreMovieEntity])],
  providers: [GenreService],
  exports: [GenreService],
  controllers: [GenreController],
})
export class GenreModule {}
