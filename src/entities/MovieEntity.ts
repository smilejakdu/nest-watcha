import { CoreEntity } from './CoreEntity';
import { IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, JoinTable, ManyToMany} from 'typeorm';
import { AgeLimitStatus, GenreEntity } from './GenreEntity';

@Entity({ schema: 'nest_watcha', name: 'movies' })
export class MovieEntity extends CoreEntity{
  @IsString()
  @IsNotEmpty()
  @Column('varchar',{name:'movieName',length:100})
  movieTitle:string;

  @Column('decimal', { precision: 5, scale: 2 })
  movieScore:number;

  @Column()
  movieImage:string;

  @Column()
  director:string[]

  @Column()
  appearance:string[];

  @Column({
    type: 'enum',
    enum: AgeLimitStatus,
    default:AgeLimitStatus.FIFTEEN_MORE_THAN
  })
  ageLimitStatus:number;

  @Column('int', { name: 'genreId', nullable: false })
  genreId: number;

  @ManyToMany(()=>GenreEntity,genre => genre.movies)
  @JoinTable({
    name:'genremovie',
    joinColumn:{
      name:'movieId',
      referencedColumnName:'id',
  },
    inverseJoinColumn:{
      name:'genreId',
      referencedColumnName:'id',
    },
  })
  genre:GenreEntity[];
}