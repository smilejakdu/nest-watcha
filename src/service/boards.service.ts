import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { BoardsRepository } from '../database/repository/boards.repository';
import { CoreResponse, SuccessFulResponse } from '../shared/CoreResponse';
import { Pagination } from '../shared/pagination';
import { AbstractService } from '../shared/abstract.service';
import { UpdateBoardDto } from '../controller/board/board.controller.dto/update-board.dto';

@Injectable()
export class BoardsService extends AbstractService {
	constructor(
		private readonly boardsRepository : BoardsRepository,
	) {
		super(boardsRepository);
	}

	async createBoard(data, userId: number):Promise<CoreResponse> {
		const createdBoard = await this.boardsRepository.createBoard({data, userId});
		if(!createdBoard){
			throw new BadRequestException('BAD REQUEST');
		}
		return SuccessFulResponse(createdBoard,HttpStatus.CREATED);
	}

	async findAllBoards(pagination?:Pagination):Promise<CoreResponse> {
		const skip = Number((pagination.page - 1) * pagination.limit);
		const foundAllBoards = await this.boardsRepository.findAllBoards()
			.skip(skip)
			.take(pagination.limit)
			.getMany();
		return SuccessFulResponse(foundAllBoards);
	}

	async updateBoard(boardId: number, data: UpdateBoardDto) {
		const foundBoard = await this.boardsRepository.findOne({id:boardId});
		if(!foundBoard){
			throw new NotFoundException('해당하는 게시판이 없습니다.');
		}

		const updatedBoard = await this.boardsRepository.update(foundBoard.id, data);

		return SuccessFulResponse(updatedBoard);
	}

	async deleteBoardOne(boardId: number) {
		const deletedBoard = await this.boardsRepository.softDelete(boardId);
		return SuccessFulResponse(deletedBoard.raw.insertId);
	}
}
