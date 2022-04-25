import { BoardsEntity } from '../entities/boards.entity';
import {
  EntityManager,
  EntityRepository,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
  TransactionManager
} from 'typeorm';

@EntityRepository(BoardsEntity)
export class BoardsRepository extends Repository<BoardsEntity>{
  makeQueryBuilder(queryRunner?: QueryRunner): SelectQueryBuilder<BoardsEntity> {
    return this.createQueryBuilder('boards', queryRunner);
  }

  async createBoard(data, @TransactionManager() transactionManager:EntityManager) {
    const newBoard = new BoardsEntity();
    Object.assign(newBoard ,data);
    const createdBoard = await transactionManager.save(BoardsEntity, newBoard);
    return createdBoard.id;
  }

  findAllBoards(){
    return this.makeQueryBuilder()
      .select([
        'boards.id',
        'boards.title',
        'boards.content',
        'boards.updatedAt',
        'user.username',
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
      .innerJoin('boards.Comments','comments')
      .leftJoin('boards.Images','images');
  }

  findAllBoardsWithUser(){
    return this.makeQueryBuilder()
      .leftJoin('boards.User', 'user');
  }

   findById(boardId:number){
    return this.makeQueryBuilder()
      .where('boards.id=:id',{id:boardId});
  }

   updateBoardOne(boardId:number,set:any){
    return this.findById(boardId)
      .update<BoardsEntity>(BoardsEntity, set);
  }

   deleteBoardOne(boardId:number){
    return this.findById(boardId)
      .softDelete()
      .from(BoardsEntity);
  }
}