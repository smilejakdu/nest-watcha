import { EntityRepository, QueryRunner, Repository, SelectQueryBuilder } from 'typeorm';
import { CommentsEntity } from '../entities/comments.entity';

@EntityRepository(CommentsEntity)
export class CommentsRepository extends Repository<CommentsEntity>{
  makeQueryBuilder(queryRunner?: QueryRunner): SelectQueryBuilder<CommentsEntity> {
    return this.createQueryBuilder('comments', queryRunner);
  }

  findAll() {
    return this.makeQueryBuilder()
      .where('comments.deletedAt is NULL');
  }

  findOneById(commentId:number){
    return this.findAll()
      .andWhere('comments.id=:id ', {id:commentId});
  }

  findOneWithBoardAndUserById(commentId:number){
    return this.findOneById(commentId)
      .addSelect([
        'board.id'
      ])
      .addSelect([
        'user.id'
      ])
      .innerJoin('comments.Board','board')
      .innerJoin('comments.User','user');
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

  updateComment(content:string , commentId:number) {
    return this.findOneById(commentId)
      .update()
      .set({
        content : content,
      })
      .execute();
  }

  deleteComment(commentId: number) {
    return this.findOneById(commentId)
      .softDelete()
      .from(CommentsEntity)
      .execute();
  }
}