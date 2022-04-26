import { Column, Entity, OneToMany } from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';
// Entity
import { CoreEntity } from './core.entity';
import { GenreMovieEntity } from './genreMovie.entity';

export enum AgeLimitStatus {
    ADLUT_MORE_THAN = 19,
    FIFTEEN_MORE_THAN = 15,
}

@Entity({ schema: 'nest_watcha', name: 'genre' })
export class GenreEntity extends CoreEntity {
    @IsString()
    @IsNotEmpty()
    @Column('varchar', { name: 'name', length: 150 })
    name: string;

    @OneToMany(
      () => GenreMovieEntity,
      genreMovieEntity => genreMovieEntity.Genre,{
          cascade: true,
      })
    Genremovie: GenreMovieEntity[];
}
