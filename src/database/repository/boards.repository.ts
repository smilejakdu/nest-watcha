import { BoardsEntity } from '../entities/boards.entity';
import {
  EntityRepository,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { transactionRunner } from '../../shared/common/transaction/transaction';

@EntityRepository(BoardsEntity)
export class BoardsRepository extends Repository<BoardsEntity>{
  makeQueryBuilder(queryRunner?: QueryRunner): SelectQueryBuilder<BoardsEntity> {
    return this.createQueryBuilder('boards', queryRunner);
  }

  async createBoard(data) {
    const newBoard = new BoardsEntity();
    Object.assign(newBoard ,data);
    const createdBoard = await transactionRunner(async (queryRunner:QueryRunner)=>{
      return await queryRunner.manager.save(BoardsEntity,newBoard);
    });
    return createdBoard.id;
  }

  findAllBoards(){
    return this.makeQueryBuilder()
      .select([
        'boards.id',
        'boards.title',
        'boards.content',
        'boards.updatedAt',
        'user.email',
      ])
      .addSelect([
        'images.id',
        'images.imagePath'
      ])
      .addSelect([
        'comments.id',
        'comments.content',
        'comments.updatedAt',
      ])
      .innerJoin('boards.User','user')
      .leftJoin('boards.Comments','comments')
      .leftJoin('boards.Images','images');
  }
}