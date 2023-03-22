import { BoardsEntity } from '../../entities/Board/Boards.entity';
import {
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import {CustomRepository} from "../../../shared/typeorm-ex.decorator";

@CustomRepository(BoardsEntity)
export class BoardsRepository extends Repository<BoardsEntity>{
  makeQueryBuilder(queryRunner?: QueryRunner): SelectQueryBuilder<BoardsEntity> {
    return this.createQueryBuilder('boards', queryRunner);
  }

  findBoardAndComments(boardId: number) {
    return this.makeQueryBuilder()
      .leftJoinAndSelect('board.Comments', 'comments')
      .where('board.id=:boardId', { boardId })
      .orderBy('board.createdAt', 'DESC')
      .getManyAndCount();
  }

  async findMyBoardByUserId(userId: number) {
    return this.makeQueryBuilder()
      .select([
        'boards.id',
        'boards.title',
        'boards.content',
        'boards.updatedAt',
      ])
      .addSelect([
        'boardImages.id',
        'boardImages.imagePath'
      ])
      .leftJoin('boards.boardImages','boardImages')
      .where('boards.user_id =:user_id',{user_id: userId})
      .getMany();
  }

  async findAllBoards(
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