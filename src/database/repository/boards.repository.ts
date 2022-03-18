import { BoardsEntity } from '../entities/boards.entity';
import { EntityRepository, QueryRunner, Repository, SelectQueryBuilder } from 'typeorm';
import { Pagination } from '../../shared/pagination';

@EntityRepository(BoardsEntity)
export class BoardsRepository extends Repository<BoardsEntity>{
  makeQueryBuilder(queryRunner?: QueryRunner): SelectQueryBuilder<BoardsEntity> {
    return this.createQueryBuilder('boards', queryRunner);
  }

  async createBoard(data, userId: number) {
    const {title , content } = data;
    const createdBoard = await this.makeQueryBuilder()
      .insert()
      .values({
        userId: userId,
        title : title,
        content:content,
      })
      .execute();
    return createdBoard.raw.insertId;
  }

  findAllBoardsWithUser(){
    return this.findAllBoards()
      .leftJoin('boards.User', 'user');
  }

  findAllBoards(pagination?:Pagination){
    return this.makeQueryBuilder()
      .where('boards.deletedAt is null');
  }

  findMyBoard(userId:number){
    return this.findAllBoards()
      .innerJoin('boards.User','user')
      .leftJoin('')
      .where('boards.userId =:userId',{userId});
  }

   findById(boardId:number){
    return this.findAllBoards()
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