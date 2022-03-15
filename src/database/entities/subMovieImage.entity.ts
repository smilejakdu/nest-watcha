import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CoreEntity } from './core.entity';
import { MovieEntity } from './movie.entity';

@Entity({ schema: 'nest_watcha', name: 'board_images' })
export class subMovieImageEntity extends CoreEntity {
  @IsString()
  @ApiProperty({
    example: 'imageString',
    description: 'imageString',
  })
  @Column('varchar', { name: 'imageString', length: 250 })
  imageString: string;

  @Column('int', { name: 'boardId', nullable: true })
  movieId: number;

  @ManyToOne(() => MovieEntity, movies => movies.subImage, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'boardId', referencedColumnName: 'id' }])
  movie: MovieEntity;
}
