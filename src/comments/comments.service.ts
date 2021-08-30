import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Boards } from 'src/entities/Boards';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';
import { Comments } from 'src/entities/Comments';

@Injectable()
export class CommentsService {
	constructor(
		@InjectRepository(Users) private usersRepository: Repository<Users>,
		@InjectRepository(Boards) private boardsRepository: Repository<Boards>,
		@InjectRepository(Comments)
		private commentsRepository: Repository<Comments>,
	) {}

	async findBoardAndComments(boardId: number) {
		return this.boardsRepository
			.createQueryBuilder('board')
			.innerJoinAndSelect(
				'board.BoardToComments',
				'commentsOfBoard',
				'commentsOfBoard.BoardId =:BoardId',
				{ boardId },
			)
			.orderBy('commentsOfBoard.createdAt', 'DESC')
			.getManyAndCount();
	}

	// async findBoardAndComments(boardId: number) {
	// 	return this.boardsRepository.findOne({
	// 		where: { id: boardId },
	// 		relations: ['BoardToComments'],
	// 	});
	// }
	// 사실 이렇게 해도 되지만
	// 차이점에 대해서 여쭤봐도 될까요 ??

	async createComment(content: string, BoardId: number, UserId: number) {
		console.log(BoardId, UserId, content);
		const comment = new Comments();

		comment.content = content;
		comment.BoardId = BoardId;
		comment.UserId = UserId;
		await this.commentsRepository.save(comment);
	}

	async updateComment(content: string, commentId: number) {
		console.log(content, commentId);
	}
}
