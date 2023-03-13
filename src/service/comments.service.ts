import {Injectable, NotFoundException} from '@nestjs/common';
// Entity
import { CommentsRepository } from '../database/repository/comments.repository';
import { BoardsRepository } from '../database/repository/BoardRepository/boards.repository';
import { UserRepository } from '../database/repository/user.repository';
import {SuccessFulResponse} from "../shared/CoreResponse";
import { DataSource } from 'typeorm';
import {UpdateCommentDto} from "../controller/comments/comments.controller.dto/update-comment.dto";
import {CommentsEntity} from "../database/entities/comments/comments.entity";
import { transactionRunner } from 'src/shared/common/transaction/transaction';
import {Configuration, CreateCompletionRequest, OpenAIApi} from "openai";
import { ReplyEntitiy } from "../database/entities/comments/reply.entitiy";


@Injectable()
export class CommentsService {
	private readonly openAiApi: OpenAIApi

	constructor(
		private readonly userRepository: UserRepository,
		private readonly boardsRepository: BoardsRepository,
		private readonly commentsRepository: CommentsRepository,
		private readonly dataSource: DataSource,
	) {
		const configuration = new Configuration({
			organization: process.env.ORGANIZATION,
			apiKey: process.env.OPENAI_API_KEY,
		});
		this.openAiApi = new OpenAIApi(configuration);
	}

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

	async createCommentWithOpenAI(content: string) {
		const DEFALUT_MODEL_ID = 'text-davinci-003'
		const DEFAULT_TEMPERATURE = 0.9

		try {
			const param: CreateCompletionRequest = {
				prompt:content,
				model: DEFALUT_MODEL_ID,
				temperature: DEFAULT_TEMPERATURE,
				max_tokens: 1000,
			}

			const response = await this.openAiApi.createCompletion(param);
			console.log(response.data)
			return SuccessFulResponse(response.data['choices'])
		} catch (error) {
			console.log(error);
		}
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
		
		return SuccessFulResponse(updatedComment);
	}

	async deleteComment(commentId: number) {
		const foundComment = await this.commentsRepository.findOneBy({id: commentId});

		if (!foundComment) {
			throw new NotFoundException('해당 댓글이 존재하지 않습니다.', String(commentId));
		}

		const deletedComment = await transactionRunner(async (queryRunner) => {
			return await queryRunner.manager.softDelete(CommentsEntity, {id:foundComment.id});
		});

		return SuccessFulResponse(deletedComment);
	}

	async createReplyComment(reply: string, commentId: number, userId: number) {
		const newReplyComment = new ReplyEntitiy();
		Object.assign(newReplyComment, {content: reply, comment_id: commentId, user_id: userId});

		const createdReplyComment = await transactionRunner(async (queryRunner) => {
			return await queryRunner.manager.save(ReplyEntitiy, newReplyComment);
		});

		return SuccessFulResponse(createdReplyComment);
	}
}
