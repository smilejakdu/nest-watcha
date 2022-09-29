import { Column, Entity, OneToMany } from 'typeorm';
import { CoreEntity } from '../core.entity';
import { IsNotEmpty, IsString } from 'class-validator';
import { MovieEntity } from './movie.entity';

@Entity({ schema: 'nest_watcha', name: 'movie_options' })
export class MovieOptionEntity extends CoreEntity {
  @Column('varchar', { name: 'price', length: 150 })
  price: number;

  @OneToMany(
    () => MovieEntity,
    movie => movie.MovieOption
  )
  Movies: MovieEntity[];
}