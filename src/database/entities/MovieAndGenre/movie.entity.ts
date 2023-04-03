import { CoreEntity } from '../core.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AgeLimitStatus } from './genre.entity';
import { GenreMovieEntity } from './genreMovie.entity';
import { JsonTransformer } from '../../transformer';
import { subMovieImageEntity } from './subMovieImage.entity';
import { OrderLogEntity } from '../Order/orderLog.entity';
import { MovieOptionEntity } from './movieOption.entity';
import {MovieReviewEntitiy} from "../movieReview/movieReview.entitiy";

@Entity({ schema: 'nest_watcha', name: 'movies' })
export class MovieEntity extends CoreEntity {
	@Column('varchar', { name: 'movie_title', length: 100 })
	movie_title: string;

	@Column('varchar', { name: 'movie_description', length: 200 })
	movie_description: string;

	@Column('decimal', { precision: 5, scale: 2, nullable: true })
	movie_score: number;

	@Column('varchar', {
		name: 'movieImage',
		nullable: true,
	})
	movie_image: string;

	@Column({
		type: 'text',
		nullable: true,
		transformer: JsonTransformer,
	})
	director: Record<string, any>;

	@Column({
		type: 'text',
		nullable: true,
		transformer: JsonTransformer,
	})
	appearance: Record<string, any>;

	@Column({
		type: 'enum',
		enum: AgeLimitStatus,
		default: AgeLimitStatus.FIFTEEN_MORE_THAN,
	})
	age_limit_status: AgeLimitStatus;

	like_counts_avg: string;

	@OneToMany(() => GenreMovieEntity, genreMovie => genreMovie.Movie)
	genreMovie: GenreMovieEntity[];

	@OneToMany(() => subMovieImageEntity, subMovie => subMovie.movie)
	subMovieImage: subMovieImageEntity[];

	@OneToMany(() => OrderLogEntity, orderLog => orderLog.Movie)
	OrderLog: OrderLogEntity[];

	@OneToMany(() => MovieReviewEntitiy, movieReview => movieReview.movie)
	movieReviews: MovieReviewEntitiy[];

	@Column('int', { name: 'movie_option_id', nullable: true })
	movie_option_id: number| null;

	@ManyToOne(() => MovieOptionEntity, movieOption => movieOption.Movies, {
		onDelete: 'SET NULL',
		onUpdate: 'CASCADE',
	})
	@JoinColumn([{ name: 'movie_option_id', referencedColumnName: 'id' }])
	MovieOption: MovieOptionEntity;
}
