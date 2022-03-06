import { CoreEntity } from './CoreEntity';
import { IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, OneToMany, QueryRunner } from 'typeorm';
import { AgeLimitStatus, GenreEntity } from './GenreEntity';
import { GenreMovieEntity } from './GenreMovieEntity';
import { JsonTransformer } from '../transformer';

@Entity({ schema: 'nest_watcha', name: 'movies' })
export class MovieEntity extends CoreEntity{
  @IsString()
  @IsNotEmpty()
  @Column('varchar',{name:'movieTitle',length:100})
  movieTitle:string;

  @Column('decimal', { precision: 5, scale: 2 })
  movieScore:number;

  @Column('varchar',{
    name:'movieImage',
    nullable: false,
  })
  movieImage: string;

  @Column({
    type: 'text',
    nullable: true,
    transformer: JsonTransformer,
  })
  director:string[]

  @Column({
    type: 'text',
    nullable: true,
    transformer: JsonTransformer,
  })
  appearance:string[];

  @Column({
    type: 'enum',
    enum: AgeLimitStatus,
    default:AgeLimitStatus.FIFTEEN_MORE_THAN
  })
  ageLimitStatus:AgeLimitStatus;

  @OneToMany(
    ()=>GenreMovieEntity,
    genreMovie => genreMovie.Movie
  )
  Genremovie:GenreMovieEntity[];

  static makeQueryBuilder(queryRunner?: QueryRunner) {
    if (queryRunner) {
      return queryRunner.manager.createQueryBuilder(MovieEntity, 'movie');
    } else {
      return this.createQueryBuilder('movie');
    }
  }

  static findAll(queryRunner?: QueryRunner) {
    return this.makeQueryBuilder(queryRunner).where('movie.deletedAt is NULL');
  }

  static findByid(id: number, queryRunner?: QueryRunner) {
    return this.makeQueryBuilder(queryRunner)
      .innerJoinAndSelect(GenreEntity,'genre')
      .where('movie.id=:id ', {id})
      .andWhere('movie.deletedAt is NULL');
  }
}