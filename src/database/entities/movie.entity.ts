import { CoreEntity } from './core.entity';
import { IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';
import { AgeLimitStatus } from './genre.entity';
import { GenreMovieEntity } from './genreMovie.entity';
import { JsonTransformer } from '../transformer';
import { subMovieImageEntity } from './subMovieImage.entity';

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

  @OneToMany(
    ()=>subMovieImageEntity,
    subMovie => subMovie.movie
  )
  subImage:subMovieImageEntity[];
}