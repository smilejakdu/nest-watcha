import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CoreEntity } from './CoreEntity';
import { GenreEntity } from './GenreEntity';
import { MovieEntity } from './MovieEntity';

@Entity({ schema: 'nest_watcha', name: 'genre_movie' })
export class GenreMovieEntity extends CoreEntity{
  @Column('int', { name: 'genreId' })
  genreId: number;

  @Column('int', { name: 'movieId' })
  movieId: number;

  @ManyToOne(() => GenreEntity, genre => genre.Genremovie, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({name:'genreId'})
  Genre: GenreEntity;

  @ManyToOne(() => MovieEntity, movie => movie.Genremovie, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({name:'movieId'})
  Movie: MovieEntity;
}
