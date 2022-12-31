import { QueryRunner, Repository, SelectQueryBuilder } from 'typeorm';
import { CommentsEntity } from '../entities/comments.entity';
import { CustomRepository } from "../../shared/typeorm-ex.decorator";

@CustomRepository(CommentsEntity)
export class CommentsRepository extends Repository<CommentsEntity>{
  makeQueryBuilder(queryRunner?: QueryRunner): SelectQueryBuilder<CommentsEntity> {
    return this.createQueryBuilder('comments', queryRunner);
  }

  async findOneWithBoardAndUserById(commentId:number) {
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

  async deleteComment(commentId: number) {
    return this.makeQueryBuilder()
      .softDelete()
      .from(CommentsEntity)
      .where('comments.id=:id ', {id:commentId})
      .execute();
  }
}