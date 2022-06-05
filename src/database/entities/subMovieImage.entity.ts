import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CoreEntity } from './core.entity';
import { MovieEntity } from './movie.entity';

@Entity({ schema: 'nest_watcha', name: 'sub_movie_image' })
export class subMovieImageEntity extends CoreEntity {
	@IsString()
	@ApiProperty({
		example: 'imageString',
		description: 'imageString',
	})
	@Column('varchar', { name: 'imageString', length: 250 })
	imageString: string;

	@Column('int', { name: 'movieId', nullable: true })
	movieId: number;

	@ManyToOne(() => MovieEntity, movies => movies.subMovieImage, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	@JoinColumn([{ name: 'movieId', referencedColumnName: 'id' }])
	movie: MovieEntity;
}
