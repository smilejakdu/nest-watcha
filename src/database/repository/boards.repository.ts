import { BoardsEntity } from '../entities/boards.entity';
import { EntityRepository, QueryRunner, Repository, SelectQueryBuilder } from 'typeorm';

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

  findAllBoards(){
    return this.makeQueryBuilder()
      .innerJoin('boards.Images','images');
  }

  findAllBoardsWithUser(){
    return this.makeQueryBuilder()
      .leftJoin('boards.User', 'user');
  }

  findMyBoard(userId:number) {
    return this.makeQueryBuilder()
      .addSelect([
        'images.id',
        'images.imagePath'
      ])
      .innerJoin('boards.Images','images')
      .where('boards.userId =:userId',{userId});
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