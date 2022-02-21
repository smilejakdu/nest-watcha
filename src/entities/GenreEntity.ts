import {
    Column,
    Entity,
    OneToMany
} from 'typeorm';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
// Entity
import { CoreEntity } from './CoreEntity';
import { GenreMovieEntity } from './GenreMovieEntity';

export enum AgeLimitStatus {
    ADLUT_MORE_THAN = 19,
    FIFTEEN_MORE_THAN = 15,
}

@Entity({ schema: 'nest_watcha', name: 'genre' })
export class GenreEntity extends CoreEntity {
    @IsString()
    @IsNotEmpty()
    @Column('varchar', { name: 'genreName', length: 150 })
    genreName: string;

    @OneToMany(() => GenreMovieEntity, genreMovie => genreMovie.Genre)
    Genremovie!: GenreMovieEntity[];
}
