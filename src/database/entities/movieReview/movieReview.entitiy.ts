import {CoreEntity} from "../core.entity";
import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";
import {MovieEntity} from "../MovieAndGenre/movie.entity";
import { UsersEntity } from "../User/Users.entity";

@Entity({ schema: 'nest_watcha', name: 'movie_reviews' })
export class MovieReviewEntitiy extends CoreEntity {
  @Column('varchar', { name: 'content', length: 500 })
  content: string;

  @Column('float', { name: 'like_counts', precision: 10, scale: 1, nullable: true })
  like_counts: number;

  @Column('int', { name: 'user_id', nullable: true })
  user_id: number| null;

  @Column('int', { name: 'movie_id', nullable: true })
  movie_id: number| null;

  @ManyToOne(() => UsersEntity, user => user.movieReviews)
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity;

  @ManyToOne(() => MovieEntity, movie => movie.movieReviews)
  @JoinColumn({ name: 'movie_id' })
  movie: MovieEntity;
}