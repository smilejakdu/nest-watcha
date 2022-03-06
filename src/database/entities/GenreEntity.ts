import { Column, Entity, OneToMany, QueryRunner } from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';
// Entity
import { CoreEntity } from './CoreEntity';
import { GenreMovieEntity } from './GenreMovieEntity';
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

    @OneToMany(
      () => GenreMovieEntity,
        genreMovie => genreMovie.Genre
    )
    Genremovie: GenreMovieEntity[];

    static makeQueryBuilder(queryRunner?: QueryRunner) {
        if (queryRunner) {
            return queryRunner.manager.createQueryBuilder(GenreEntity, 'genre');
        } else {
            return this.createQueryBuilder('genre');
        }
    }

    static findAll(queryRunner?: QueryRunner) {
        return this.makeQueryBuilder(queryRunner).where('genre.deletedAt is NULL');
    }

    static findByid(id: number, queryRunner?: QueryRunner) {
        return this.makeQueryBuilder(queryRunner)
          .leftJoinAndSelect(GenreMovieEntity,'genreMovie')
          .leftJoinAndSelect(MovieEntity ,'movie')
          .where('genre.id=:id ', {id})
          .andWhere('genre.deletedAt is NULL');
    }

    static createGenre(genreName : string) {
        this.makeQueryBuilder()
          .insert()
          .values({
            genreName:genreName,
          }).execute();
    }
}
