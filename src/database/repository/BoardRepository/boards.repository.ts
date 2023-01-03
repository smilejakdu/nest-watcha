import { BoardsEntity } from '../../entities/Board/Boards.entity';
import {
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { transactionRunner } from '../../../shared/common/transaction/transaction';
import {CustomRepository} from "../../../shared/typeorm-ex.decorator";
import {take} from "rxjs";

@CustomRepository(BoardsEntity)
export class BoardsRepository extends Repository<BoardsEntity>{
  makeQueryBuilder(queryRunner?: QueryRunner): SelectQueryBuilder<BoardsEntity> {
    return this.createQueryBuilder('boards', queryRunner);
  }

  async createBoard(data) {
    const newBoard = new BoardsEntity();
    console.log('before new Board', newBoard);
    Object.assign(newBoard ,data);
    console.log('after new Board', newBoard);
    const createdBoard = await transactionRunner(async (queryRunner:QueryRunner)=>{
      return await queryRunner.manager.save(BoardsEntity,newBoard);
    });
    console.log('createdBoard :', createdBoard);
    return createdBoard.id;
  }

  findBoardAndComments(boardId: number) {
    return this.makeQueryBuilder()
      .leftJoinAndSelect('board.Comments', 'comments')
      .where('board.id=:boardId', { boardId })
      .orderBy('board.createdAt', 'DESC')
      .getManyAndCount();
  }

  findAllBoards(
    pageNumber= 1,
  ) {
    const take = 10;
    const skip = (pageNumber - 1) * take;

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
      .leftJoin('boards.Images','images')
      .skip(skip)
      .take(take)
      .getMany();
  }
}