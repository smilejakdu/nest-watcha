import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CoreEntity } from '../core.entity';
import { GenreEntity } from './genre.entity';
import { MovieEntity } from './movie.entity';

@Entity({ schema: 'nest_watcha', name: 'genre_movie' })
export class GenreMovieEntity extends CoreEntity {
	@Column('int', { name: 'genreId', nullable: true })
	genreId: number;

	@Column('int', { name: 'movieId', nullable: true })
	movieId: number;

	@ManyToOne(() => GenreEntity,
			genre => genre.genreMovie, {
		onDelete: 'SET NULL',
		onUpdate: 'CASCADE',
	})
	@JoinColumn({ name: 'genreId' })
	Genre: GenreEntity;

	@ManyToOne(() => MovieEntity,
			movie => movie.genreMovie, {
		onDelete: 'SET NULL',
		onUpdate: 'CASCADE',
	})
	@JoinColumn({ name: 'movieId' })
	Movie: MovieEntity;
}
