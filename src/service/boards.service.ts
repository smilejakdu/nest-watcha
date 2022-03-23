import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { BoardsRepository } from '../database/repository/boards.repository';
import { CoreResponse } from '../shared/CoreResponse';
import { Pagination } from '../shared/pagination';

@Injectable()
export class BoardsService {
	constructor(
		private readonly boardsRepository : BoardsRepository,
	) {}

	async createBoard(data, userId: number):Promise<CoreResponse> {
		const createdBoard = await this.boardsRepository.createBoard(data, userId);
		if(!createdBoard){
			throw new BadRequestException('BAD REQUEST');
		}
		return {
			ok: true,
			statusCode : HttpStatus.CREATED,
			message: 'SUCCESS',
			data: createdBoard ,
		};
	}

	async findAllBoards(pagination?:Pagination):Promise<CoreResponse> {
		const skip = Number((pagination.page - 1) * pagination.limit);
		const foundAllBoards = await this.boardsRepository.findAllBoards()
			.skip(skip)
			.take(pagination.limit)
			.getMany();
		return {
			ok : true,
			statusCode : HttpStatus.OK ,
			message: 'SUCCESS',
			data: foundAllBoards,
		};
	}

	async updateBoard(boardId: number, title: string, content: string) {
		const foundBoard = await this.boardsRepository.findById(boardId).getOne();
		if(!foundBoard){
			throw new NotFoundException('해당하는 게시판이 없습니다.');
		}
		const responseUpdatedBoard = await this.boardsRepository
			.updateBoardOne(foundBoard.id,{title,content})
			.execute();

		return {
			ok: true,
			statusCode : HttpStatus.OK ,
			message: 'SUCCESS',
			data: responseUpdatedBoard.raw.insertId,
		};
	}

	async deleteBoardOne(boardId: number) {
		const responseDeletedBoardId = await this.boardsRepository
			.deleteBoardOne(boardId)
			.execute();

		return {
			ok: true,
			statusCode : HttpStatus.OK ,
			message: 'SUCCESS',
			data: responseDeletedBoardId.raw.insertId,
		};
	}
}
