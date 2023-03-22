import { QueryRunner, Repository, SelectQueryBuilder } from 'typeorm';
import { CommentsEntity } from '../entities/comments/comments.entity';
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

  async findCommentByBoardId(
    boardId: number,
    pageNumber: number,
    size: number,
  ) {
    const skip = (pageNumber - 1) * size;

    const findQuery = await this.makeQueryBuilder()
      .select([
        'comments.id',
        'comments.content',
        'comments.like_counts',
        'comments.createdAt',
      ])
      .addSelect([
        'user.id',
        'user.username',
        'user.email',
      ])
      .innerJoin('comments.User', 'user')
      .where('comments.boardId=:boardId', { boardId })
      .orderBy('comments.createdAt', 'DESC')

    const foundTotalData = await findQuery.getRawMany();
    const lastPage = Math.ceil(foundTotalData.length / size);
    const sumLikesCount = foundTotalData.reduce((acc, cur) => acc + parseFloat(cur.like_counts), 0) / foundTotalData.length;

    return  {
      'lastPage': lastPage,
      'nextPage': Number(pageNumber) + 1 <= lastPage ? Number(pageNumber) + 1 : null,
      'totalCount': foundTotalData.length,
      'sumLikesCount': sumLikesCount.toFixed(1),
      'data': await findQuery
        .orderBy('comments.createdAt','DESC')
        .offset(skip)
        .limit(size)
        .getRawMany(),
    };
  }

  async deleteComment(commentId: number) {
    return this.makeQueryBuilder()
      .softDelete()
      .from(CommentsEntity)
      .where('comments.id=:id ', {id:commentId})
      .execute();
  }
}