import { EntityRepository, QueryRunner, Repository, SelectQueryBuilder } from 'typeorm';
import { BoardImageEntity } from '../entities/BoardImage.entity';
import { BoardsEntity } from '../entities/boards.entity';

@EntityRepository(BoardImageEntity)
export class boardImageRepository extends Repository<BoardImageEntity> {
  makeQueryBuilder(queryRunner?: QueryRunner): SelectQueryBuilder<BoardsEntity> {
    return this.createQueryBuilder('board_image', queryRunner);
  }
}