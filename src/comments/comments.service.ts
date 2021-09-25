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
			.innerJoinAndSelect('board.Comments', 'comments')
			.where('board.id=:BoardId', { BoardId: boardId })
			.orderBy('comments.createdAt', 'DESC')
			.getManyAndCount();
	}

	async createComment(content: string, BoardId: number, UserId: number) {
		const comment = new Comments();

		comment.content = content;
		comment.BoardId = BoardId;
		comment.UserId = UserId;
		await this.commentsRepository.save(comment);
	}

	async updateComment(content: string, commentId: number) {
		const commentObject = await this.commentsRepository.findOne({
			id: commentId,
		});
		commentObject.content = content;
		await this.commentsRepository.save(commentObject);
	}

	async deleteComment(CommentId: number) {
		const comment = await this.boardsRepository.findOne({
			where: { id: CommentId },
		});
		await this.commentsRepository.delete(comment);
	}
}
