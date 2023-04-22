import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CoreEntity } from '../core.entity';
import { GenreEntity } from './genre.entity';
import { MovieEntity } from './movie.entity';

@Entity({ schema: 'nest_watcha', name: 'genre_movie' })
export class GenreMovieEntity extends CoreEntity {
	@Column('int', { name: 'genre_id', nullable: true })
	genre_id: number;

	@Column('int', { name: 'movie_id', nullable: true })
	movie_id: number;

	@ManyToOne(() => GenreEntity,
			genre => genre.genreMovie, {
		onDelete: 'SET NULL',
		onUpdate: 'CASCADE',
	})
	@JoinColumn({ name: 'genre_id' })
	genre: GenreEntity;

	@ManyToOne(() => MovieEntity,
			movie => movie.genreMovie, {
		onDelete: 'SET NULL',
		onUpdate: 'CASCADE',
	})
	@JoinColumn({ name: 'movie_id' })
	movie: MovieEntity;
}
