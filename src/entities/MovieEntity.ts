import { CoreEntity } from './CoreEntity';
import { IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AgeLimitStatus} from './GenreEntity';
import { GenreMovieEntity } from './GenreMovieEntity';
import { CartEntity } from './CartEntity';

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

  @Column({
    type: 'text',
    nullable:false
  })
  director:string[]

  @Column({
   type: 'text',
    nullable:false
  })
  appearance:string[];

  @Column({
    type: 'enum',
    enum: AgeLimitStatus,
    default:AgeLimitStatus.FIFTEEN_MORE_THAN
  })
  ageLimitStatus:AgeLimitStatus;

  @OneToMany(()=>GenreMovieEntity,
    genreMovie => genreMovie.Movie)
  Genremovie!:GenreMovieEntity[];

  @ManyToOne(() =>CartEntity,
    cart => cart.id,
    {nullable: false},
  )
  cart : CartEntity;
}