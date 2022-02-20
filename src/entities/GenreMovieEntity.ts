import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CoreEntity } from './CoreEntity';
import { GenreEntity } from './GenreEntity';
import { MovieEntity } from './MovieEntity';

@Entity({ schema: 'nest_watcha', name: 'genremovie' })
export class GenreMovieEntity extends CoreEntity {
  @Column('int', { name: 'genreId' })
  genreId: number;

  @Column('int', { name: 'movieId' })
  movieId: number;

  @ManyToOne(() => GenreEntity, genre => genre.movies, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'genreId', referencedColumnName: 'id' }])
  Genre: GenreEntity;

  @ManyToOne(() => MovieEntity, movie => movie.genre, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'movieId', referencedColumnName: 'id' }])
  Movie: MovieEntity;
}
