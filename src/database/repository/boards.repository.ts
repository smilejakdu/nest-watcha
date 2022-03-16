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

  async findAllBoards(){
    return await this.makeQueryBuilder()
      .leftJoin('boards.User', 'user')
      .getMany();
  }

  async findMyBoard(userId:number){
    console.log('userId:',userId);
    return this.makeQueryBuilder()
      .innerJoin('boards.User','user')
      .where('boards.userId =:userId',{userId})
      .getMany();
  }

  async findById(boardId:number){
    return await this.makeQueryBuilder()
      .where('boards.id=:id',{id:boardId})
      .getOne();
  }

  async updateBoardOne(boardId:number,set:any){
    const updatedBoard = await this.makeQueryBuilder()
      .update<BoardsEntity>(BoardsEntity, set)
      .where('board.id = :id', { id: boardId })
      .execute();

    return updatedBoard.raw.insertId;
  }

  async deleteBoardOne(boardId:number){
    const deletedBoard = await this.makeQueryBuilder()
      .softDelete()
      .where('board.boardId =:boardId', { boardId })
      .execute();

    return deletedBoard.raw.insertId;
  }
}