import { Column, Entity, JoinColumn, ManyToOne, QueryRunner } from 'typeorm';
import { CoreEntity } from './core.entity';
import { GenreEntity } from './genre.entity';
import { MovieEntity } from './movie.entity';
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGenreMovieDto {
  @IsNotEmpty()
  @ApiProperty({
    description:'movieId',
    example:1,
  })
  movieId : number;

  @IsNotEmpty()
  @ApiProperty({
    description:'genreId',
    example:1,
  })
  genreId : number;
}

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

  static makeQueryBuilder(queryRunner?: QueryRunner) {
    if (queryRunner) {
      return queryRunner.manager.createQueryBuilder(GenreMovieEntity, 'genreMovie');
    } else {
      return this.createQueryBuilder('genreMovie');
    }
  }

  static findByid(id: number, queryRunner?: QueryRunner) {
    return this.makeQueryBuilder(queryRunner)
      .where('genreMovie.id=:id ', {id})
      .andWhere('genreMovie.deletedAt is NULL');
  }

  static createGenreMovie(createGenreMovieDto : CreateGenreMovieDto) {
    return this.makeQueryBuilder()
      .insert()
      .values(createGenreMovieDto)
      .execute();
  }
}
