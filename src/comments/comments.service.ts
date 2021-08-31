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

		const commentObject = await this.commentsRepository.findOne({
			id: commentId,
		});
		commentObject.content = content;
		await this.commentsRepository.save(commentObject);
	}

	async deleteCommentOne(CommentId: number) {
		console.log(CommentId);
		const comment = await this.boardsRepository.findOne({
			where: { id: CommentId },
		});
		await this.commentsRepository.delete(comment);
	}
}
