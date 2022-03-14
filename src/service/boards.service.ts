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
		const foundAllBoards = await this.boardsRepository.findAllBoards();
		return {
			ok : !isNil(foundAllBoards),
			statusCode :!isNil(foundAllBoards) ? HttpStatus.OK : HttpStatus.NOT_FOUND,
			message: !isNil(foundAllBoards) ?'SUCCESS': 'BAD_REQUEST',
			data:!isNil(foundAllBoards) ? foundAllBoards : [],
		};
	}

	async findMyBoard(userId: number):Promise<CoreResponse> {
		const foundMyBoard = await this.boardsRepository.findMyBoard(userId);
		return {
			ok: !foundMyBoard,
			statusCode :!isNil(foundMyBoard) ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST,
			message: !isNil(foundMyBoard) ?'SUCCESS': 'BAD_REQUEST',
			data:!isNil(foundMyBoard) ? foundMyBoard : null,
		};
	}

	// async insertHashtagList(hashTagList) {
	// 	const hashtagInsertedList = await this.hashTagRepository.createQueryBuilder('hashtag').insert().values(hashTagList).execute();
	// 	return hashtagInsertedList;
	// }


	async updateBoard(boardId: number, title: string, content: string) {
		const foundBoard = await this.boardsRepository.findById(boardId);
		if(!foundBoard){
			throw new NotFoundException('해당하는 게시판이 없습니다.');
		}
		const responseUpdatedBoard = await this.boardsRepository.updateBoardOne(foundBoard.id,{title,content});
		return {
			ok: !isNil(responseUpdatedBoard),
			statusCode :!isNil(responseUpdatedBoard) ? HttpStatus.OK : HttpStatus.BAD_REQUEST,
			message: !isNil(responseUpdatedBoard) ?'SUCCESS': 'BAD_REQUEST',
			data:!isNil(responseUpdatedBoard) ? responseUpdatedBoard : null,
		};
	}

	async deleteBoardOne(boardId: number) {
		const responseBoardId = this.boardsRepository.deleteBoardOne(boardId);
		return {
			ok: !isNil(responseBoardId),
			statusCode :!isNil(responseBoardId) ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST,
			message: !isNil(responseBoardId) ?'SUCCESS': 'BAD_REQUEST',
			data:!isNil(responseBoardId) ? responseBoardId : null,
		};
	}
}
