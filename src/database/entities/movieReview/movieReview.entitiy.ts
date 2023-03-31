import {CoreEntity} from "../core.entity";
import {Column, JoinColumn, ManyToOne} from "typeorm";
import {MovieEntity} from "../MovieAndGenre/movie.entity";
import { UsersEntity } from "../User/Users.entity";

export class MovieReviewEntitiy extends CoreEntity {
  @Column('varchar', { name: 'content', length: 500 })
  content: string;

  @Column('varchar', { name: 'rating', length: 500 })
  rating: string;

  @Column('varchar', { name: 'movie_id', length: 500 })
  movie_id: string;

  @Column('varchar', { name: 'user_id', length: 500 })
  user_id: string;

  @ManyToOne(() => UsersEntity, user => user.movieReviews)
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity;

  @ManyToOne(() => MovieEntity, user => user.movieReviews)
  @JoinColumn({ name: 'movie_id' })
  movie: MovieEntity;
}