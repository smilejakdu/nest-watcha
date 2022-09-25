import { BoardsEntity } from '../../entities/Board/boards.entity';
import {
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { transactionRunner } from '../../../shared/common/transaction/transaction';
import {CustomRepository} from "../../../shared/typeorm-ex.decorator";

@CustomRepository(BoardsEntity)
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

  findBoardAndComments(boardId: number) {
    return this.makeQueryBuilder()
      .leftJoinAndSelect('board.Comments', 'comments')
      .where('board.id=:boardId', { boardId })
      .orderBy('board.createdAt', 'DESC')
      .getManyAndCount();
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