import { CoreEntity } from './core.entity';
import { IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AgeLimitStatus } from './genre.entity';
import { GenreMovieEntity } from './genreMovie.entity';
import { JsonTransformer } from '../transformer';
import { subMovieImageEntity } from './subMovieImage.entity';
import { OrderLogEntity } from './orderLog.entity';
import { MovieOptionEntity } from './movieOption.entity';

@Entity({ schema: 'nest_watcha', name: 'movies' })
export class MovieEntity extends CoreEntity{
  @IsString()
  @IsNotEmpty()
  @Column('varchar',{name:'movieTitle',length:100})
  movieTitle:string;

  @Column('decimal', { precision: 5, scale: 2 , nullable:true })
  movieScore:number;

  @Column('varchar',{
    name:'movieImage',
    nullable: true,
  })
  movieImage: string;

  @Column({
    type: 'text',
    nullable: true,
    transformer: JsonTransformer,
  })
  director:Record<string, any>;

  @Column({
    type: 'text',
    nullable: true,
    transformer: JsonTransformer,
  })
  appearance:Record<string, any>;

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
  subMovieImage:subMovieImageEntity[];

  @OneToMany(
    () => OrderLogEntity,
      orderLog => orderLog.Movie)
  OrderLog: OrderLogEntity[];

  @Column('int', { name: 'movieOptionId', nullable: true })
  movieOptionId: number|null;

  @ManyToOne(
    () => MovieOptionEntity,
    movieOption => movieOption.Movies, {
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    })
  @JoinColumn([{ name: 'movieOptionId', referencedColumnName: 'id' }])
  MovieOption: MovieOptionEntity;
}