import { BoardsEntity } from '../../entities/Board/Boards.entity';
import {
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { transactionRunner } from '../../../shared/common/transaction/transaction';
import {CustomRepository} from "../../../shared/typeorm-ex.decorator";
import {CreateBoardDto} from "../../../controller/board/board.controller.dto/create-board.dto";

@CustomRepository(BoardsEntity)
export class BoardsRepository extends Repository<BoardsEntity>{
  makeQueryBuilder(queryRunner?: QueryRunner): SelectQueryBuilder<BoardsEntity> {
    return this.createQueryBuilder('boards', queryRunner);
  }

  async createBoard(data: CreateBoardDto, user_id: number) {
    const newBoard = new BoardsEntity();
    Object.assign(newBoard ,data);
    newBoard.user_id = user_id;
    const createdBoard = await transactionRunner(async (queryRunner:QueryRunner)=>{
      return await queryRunner.manager.save(BoardsEntity,newBoard);
    });

    return createdBoard.id;
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