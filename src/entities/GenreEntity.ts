import {
    Column,
    Entity,
    ManyToMany,
} from 'typeorm';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
// Entity
import { CoreEntity } from './CoreEntity';
import { MovieEntity } from './MovieEntity';

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

    @ManyToMany(() => MovieEntity, movies => movies.genre)
    movies: MovieEntity[];
}
