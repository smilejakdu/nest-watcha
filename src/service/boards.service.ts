import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { BoardsRepository } from '../database/repository/boards.repository';
import { isNil } from 'lodash';
import { CoreResponse } from '../shared/CoreResponse';

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

	async findAllBoards():Promise<CoreResponse> {
		const foundAllBoards = await this.boardsRepository.findAllBoards().getMany();
		return {
			ok : !isNil(foundAllBoards),
			statusCode :!isNil(foundAllBoards) ? HttpStatus.OK : HttpStatus.NOT_FOUND,
			message: !isNil(foundAllBoards) ?'SUCCESS': 'BAD_REQUEST',
			data:!isNil(foundAllBoards) ? foundAllBoards : [],
		};
	}

	async findMyBoard(userId: number):Promise<CoreResponse> {
		const foundMyBoard = await this.boardsRepository.findMyBoard(userId).getMany();
		return {
			ok: !foundMyBoard,
			statusCode :!isNil(foundMyBoard) ? HttpStatus.OK : HttpStatus.BAD_REQUEST,
			message: !isNil(foundMyBoard) ?'SUCCESS': 'BAD_REQUEST',
			data:!isNil(foundMyBoard) ? foundMyBoard : null,
		};
	}

	async updateBoard(boardId: number, title: string, content: string) {
		const foundBoard = await this.boardsRepository.findById(boardId).getOne();
		if(!foundBoard){
			throw new NotFoundException('해당하는 게시판이 없습니다.');
		}
		const responseUpdatedBoard = await this.boardsRepository.updateBoardOne(foundBoard.id,{title,content}).execute();
		console.log('responseUpdatedBoard:',responseUpdatedBoard);
		return {
			ok: !isNil(responseUpdatedBoard),
			statusCode :!isNil(responseUpdatedBoard) ? HttpStatus.OK : HttpStatus.BAD_REQUEST,
			message: !isNil(responseUpdatedBoard) ?'SUCCESS': 'BAD_REQUEST',
			data:!isNil(responseUpdatedBoard) ? responseUpdatedBoard.raw.insertId : null,
		};
	}

	async deleteBoardOne(boardId: number) {
		const responseDeletedBoardId = await this.boardsRepository.deleteBoardOne(boardId).execute();
		console.log('responseDeletedBoardId:',responseDeletedBoardId);
		return {
			ok: !isNil(responseDeletedBoardId),
			statusCode :!isNil(responseDeletedBoardId) ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST,
			message: !isNil(responseDeletedBoardId) ?'SUCCESS': 'BAD_REQUEST',
			data:!isNil(responseDeletedBoardId) ? responseDeletedBoardId.raw.insertId : null,
		};
	}
}
