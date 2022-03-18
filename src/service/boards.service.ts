import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { BoardsRepository } from '../database/repository/boards.repository';
import { isNil } from 'lodash';
import { CoreResponse } from '../shared/CoreResponse';
import { Pagination } from '../shared/pagination';

@Injectable()
export class BoardsService {
	constructor(
		private readonly boardsRepository : BoardsRepository,
	) {}

	async createBoard(data, userId: number):Promise<CoreResponse> {
		const createdBoard = await this.boardsRepository.createBoard(data, userId);
		return {
			ok: !isNil(createdBoard),
			statusCode :!isNil(createdBoard) ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST,
			message: !isNil(createdBoard) ?'SUCCESS': 'BAD_REQUEST',
			data:!isNil(createdBoard) ? createdBoard : null,
		};
	}

	async findAllBoards(pagination?:Pagination):Promise<CoreResponse> {
		const skip = Number((pagination.page - 1) * pagination.limit);
		const foundAllBoards = await this.boardsRepository.findAllBoards()
			.skip(skip)
			.take(pagination.limit)
			.getMany();
		return {
			ok : !isNil(foundAllBoards),
			statusCode :!isNil(foundAllBoards) ? HttpStatus.OK : HttpStatus.NOT_FOUND,
			message: !isNil(foundAllBoards) ?'SUCCESS': 'BAD_REQUEST',
			data:!isNil(foundAllBoards) ? foundAllBoards : [],
		};
	}

	async updateBoard(boardId: number, title: string, content: string) {
		const foundBoard = await this.boardsRepository.findById(boardId).getOne();
		if(!foundBoard){
			throw new NotFoundException('해당하는 게시판이 없습니다.');
		}
		const responseUpdatedBoard = await this.boardsRepository.updateBoardOne(foundBoard.id,{title,content}).execute();
		return {
			ok: !isNil(responseUpdatedBoard),
			statusCode :!isNil(responseUpdatedBoard) ? HttpStatus.OK : HttpStatus.BAD_REQUEST,
			message: !isNil(responseUpdatedBoard) ?'SUCCESS': 'BAD_REQUEST',
			data:!isNil(responseUpdatedBoard) ? boardId : null,
		};
	}

	async deleteBoardOne(boardId: number) {
		const responseDeletedBoardId = await this.boardsRepository.deleteBoardOne(boardId).execute();
		return {
			ok: !isNil(responseDeletedBoardId),
			statusCode :!isNil(responseDeletedBoardId) ? HttpStatus.OK : HttpStatus.BAD_REQUEST,
			message: !isNil(responseDeletedBoardId) ?'SUCCESS': 'BAD_REQUEST',
			data:!isNil(responseDeletedBoardId) ? boardId : null,
		};
	}
}
