import {HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
// Entity
import { CommentsRepository } from '../database/repository/comments.repository';
import { BoardsRepository } from '../database/repository/BoardRepository/boards.repository';
import { UserRepository } from '../database/repository/user.repository';
import {SuccessFulResponse} from "../shared/CoreResponse";
import { DataSource } from 'typeorm';

@Injectable()
export class CommentsService {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly boardsRepository: BoardsRepository,
		private readonly commentsRepository: CommentsRepository,
		private readonly dataSource: DataSource,
	) {}

	async findBoardAndComments(boardId: number) {
		const boardWithComments = await this.boardsRepository.findBoardAndComments(boardId);
		if (!boardWithComments) {
			throw new NotFoundException('해당 게시글이 존재하지 않습니다.',String(boardId));
		}

		return SuccessFulResponse(boardWithComments);
	}

	async createComment(content: string, boardId: number, userId: number) {
		const queryRunner = this.dataSource.createQueryRunner()
		try {
			await queryRunner.connect();
			await queryRunner.startTransaction()
			await this.commentsRepository.createComment(content,boardId,userId);

			await queryRunner.commitTransaction()
		} catch (e) {
			await queryRunner.rollbackTransaction()
		} finally {
			await queryRunner.release()
		}

		return {
			ok: true,
			statusCode: HttpStatus.CREATED,
			message: 'CREATE SUCCESS',
		};
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
