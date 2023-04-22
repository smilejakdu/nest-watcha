import { CoreEntity } from '../core.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AgeLimitStatus } from './genre.entity';
import { GenreMovieEntity } from './genreMovie.entity';
import { JsonTransformer } from '../../transformer';
import { subMovieImageEntity } from './subMovieImage.entity';
import { OrderLogEntity } from '../Order/orderLog.entity';
import {MovieReviewEntitiy} from "../movieReview/movieReview.entitiy";
import {text} from "aws-sdk/clients/customerprofiles";

@Entity({ schema: 'nest_watcha', name: 'movies' })
export class MovieEntity extends CoreEntity {
	@Column('varchar', { name: 'title', length: 200 })
	title: string;

	@Column('varchar', { name: 'description', length: 200 })
	description: string;

	@Column('decimal', { precision: 5, scale: 2, nullable: true })
	movie_score: number;

	@Column('int', { name: 'price', nullable: true })
	price: number;

	@Column('text', { name: 'movie_image', nullable: true })
	movie_image: text;

	@Column({
		type: 'text',
		nullable: true,
		transformer: JsonTransformer,
		comment: '감독',
	})
	director: Record<string, any>;

	@Column({
		type: 'text',
		nullable: true,
		transformer: JsonTransformer,
		comment: '출연진',
	})
	appearance: Record<string, any>;

	@Column({
		type: 'enum',
		enum: AgeLimitStatus,
		default: AgeLimitStatus.FIFTEEN_MORE_THAN,
	})
	age_limit_status: AgeLimitStatus;

	like_counts_avg: string;

	@OneToMany(() => GenreMovieEntity, genreMovie => genreMovie.movie)
	genreMovie: GenreMovieEntity[];

	@OneToMany(() => subMovieImageEntity, subMovie => subMovie.movie)
	subMovieImage: subMovieImageEntity[];

	@OneToMany(() => OrderLogEntity, orderLog => orderLog.Movie)
	OrderLog: OrderLogEntity[];

	@OneToMany(() => MovieReviewEntitiy, movieReview => movieReview.movie)
	movieReviews: MovieReviewEntitiy[];
}
