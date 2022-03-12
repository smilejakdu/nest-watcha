import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// Entity
import { BoardsEntity } from 'src/database/entities/boards.entity';
import { UsersEntity } from 'src/database/entities/users.entity';
import { CommentsEntity } from 'src/database/entities/comments.entity';

@Injectable()
export class CommentsService {
	constructor(
		@InjectRepository(UsersEntity) private usersRepository: Repository<UsersEntity>,
		@InjectRepository(BoardsEntity) private boardsRepository: Repository<BoardsEntity>,
		@InjectRepository(CommentsEntity)
		private commentsRepository: Repository<CommentsEntity>,
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
		const comment = new CommentsEntity();

		comment.content = content;
		comment.boardId = boardId;
		comment.userId = userId;
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
