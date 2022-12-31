import {HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
// Entity
import { CommentsRepository } from '../database/repository/comments.repository';
import { BoardsRepository } from '../database/repository/BoardRepository/boards.repository';
import { UserRepository } from '../database/repository/user.repository';
import {SuccessFulResponse} from "../shared/CoreResponse";
import { DataSource } from 'typeorm';
import {UpdateCommentDto} from "../controller/comments/comments.controller.dto/update-comment.dto";
import {CommentsEntity} from "../database/entities/comments.entity";
import { transactionRunner } from 'src/shared/common/transaction/transaction';

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
		const foundBoard = await this.boardsRepository.findOneBy({id: boardId});
		if (!foundBoard) {
			throw new NotFoundException('해당 게시글이 존재하지 않습니다.', String(boardId));
		}
		const createdComment = await transactionRunner(async (queryRunner) => {
			return await queryRunner.manager.save(CommentsEntity,({content: content ,board_id: boardId, user_id: userId}));
		});
		console.log(createdComment);
		return SuccessFulResponse(createdComment);
	}

	async updateComment(query: UpdateCommentDto, content: string) {
		const foundComment = await this.commentsRepository.findOneBy({id: query.comment_id});

		if (!foundComment) {
			throw new NotFoundException('해당 댓글이 존재하지 않습니다.', String(query.comment_id));
		}

		const updatedComment = await transactionRunner(async (queryRunner) => {
			foundComment.content = content;
			return await queryRunner.manager.save(CommentsEntity, foundComment);
		});
		console.log(updatedComment);
		return SuccessFulResponse(updatedComment);
	}

	async deleteComment(commentId: number) {
		const deletedComment = await this.commentsRepository.deleteComment(commentId);
		return deletedComment.raw.insertId;
	}
}
