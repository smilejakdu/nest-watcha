import { Injectable } from '@nestjs/common';
// Entity
import { CommentsRepository } from '../database/repository/comments.repository';
import { BoardsRepository } from '../database/repository/BoardRepository/boards.repository';
import { UserRepository } from '../database/repository/user.repository';

@Injectable()
export class CommentsService {
	constructor(
		private readonly userRepository:UserRepository,
		private readonly boardsRepository : BoardsRepository,
		private readonly commentsRepository : CommentsRepository,
	) {}

	async findBoardAndComments(boardId: number) {
		return this.boardsRepository
			.createQueryBuilder('board')
			.innerJoinAndSelect('board.Comments', 'comments')
			.where('board.id=:boardId', { boardId })
			.orderBy('comments.createdAt', 'DESC')
			.getManyAndCount();
	}

	async createComment(content: string, boardId: number, userId: number) {
		const createdComment = await this.commentsRepository.createComment(content,boardId,userId);
		return createdComment.raw.insertId;
	}

	async updateComment(content: string, commentId: number) {
		const updatedComment = await this.commentsRepository.updateComment(content,commentId);
		return updatedComment.raw.insertId;
	}

	async deleteComment(commentId: number) {
		const deletedComment = await this.commentsRepository.deleteComment(commentId);
		return deletedComment.raw.insertId;
	}
}
