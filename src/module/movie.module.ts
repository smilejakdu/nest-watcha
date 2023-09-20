import { Module } from '@nestjs/common';
import { MoviesController } from '../controller/movies/movies.controller';
import {MovieMapper, MoviesService} from '../service/movies.service';
import { MovieRepository } from '../database/repository/MovieAndGenreRepository/movie.repository';
import { GenreMovieRepository } from '../database/repository/MovieAndGenreRepository/genreMovie.repository';
import { GenreMovieService } from '../service/genreMovie.service';
import {CommentsRepository} from "../database/repository/comments.repository";
import {MovieReviewRepository} from "../database/repository/movieReview.repository";
import {TypeOrmExModule} from "../shared/typeorm/typeorm-ex.module";

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      MovieRepository,
      GenreMovieRepository,
      CommentsRepository,
      MovieReviewRepository,
    ]),
  ],
  providers: [MoviesService, GenreMovieService, MovieMapper],
  controllers: [MoviesController],
  exports: [MoviesService],
})
export class MovieModule {}
