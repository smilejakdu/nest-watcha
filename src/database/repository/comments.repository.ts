import { QueryRunner, Repository, SelectQueryBuilder } from 'typeorm';
import { CommentsEntity } from '../entities/comments.entity';

export class CommentsRepository extends Repository<CommentsEntity>{
  makeQueryBuilder(queryRunner?: QueryRunner): SelectQueryBuilder<CommentsEntity> {
    return this.createQueryBuilder('comments', queryRunner);
  }

  async findOneWithBoardAndUserById(commentId:number){
    return this.makeQueryBuilder()
      .addSelect([
        'board.id'
      ])
      .addSelect([
        'user.id'
      ])
      .innerJoin('comments.Board','board')
      .innerJoin('comments.User','user')
      .where('comments.id=:id ', {id:commentId});
  }

  createComment(content: string, boardId: number, userId: number) {
    return this.makeQueryBuilder()
      .insert()
      .values({
        content : content,
        boardId : boardId,
        userId : userId
      }).execute();
  }

  async updateComment(content:string , commentId:number) {
    return this.makeQueryBuilder()
      .update()
      .set({
        content : content,
      })
      .where('comments.id=:id ', {id:commentId})
      .execute();
  }

  async deleteComment(commentId: number) {
    return this.makeQueryBuilder()
      .softDelete()
      .from(CommentsEntity)
      .where('comments.id=:id ', {id:commentId})
      .execute();
  }
}