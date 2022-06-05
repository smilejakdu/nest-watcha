import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { BoardsRepository } from '../database/repository/boards.repository';
import { CoreResponse, SuccessFulResponse } from '../shared/CoreResponse';
import { Pagination } from '../shared/pagination';
import { getConnection } from 'typeorm';
import { AbstractService } from '../shared/abstract.service';

@Injectable()
export class BoardsService extends AbstractService {
	constructor(
		private readonly boardsRepository : BoardsRepository,
	) {
		super(boardsRepository);
	}

	async createBoard(data, userId: number):Promise<CoreResponse> {
		const queryRunner = await getConnection().createQueryRunner();
		await queryRunner.startTransaction();
		let createdBoard;
		try{
			createdBoard = await this.boardsRepository.createBoard({data, userId} ,queryRunner.manager);
			await queryRunner.commitTransaction();
		}catch (error) {
			console.log(error);
			await queryRunner.rollbackTransaction();
		}finally {
			await queryRunner.release();
		}

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

	async updateBoard(boardId: number, title: string, content: string) {
		const foundBoard = await this.boardsRepository.findById(boardId).getOne();
		if(!foundBoard){
			throw new NotFoundException('해당하는 게시판이 없습니다.');
		}
		const responseUpdatedBoard = await this.boardsRepository
			.updateBoardOne(foundBoard.id,{title,content})
			.execute();

		return SuccessFulResponse(responseUpdatedBoard.raw.insertId);
	}

	async deleteBoardOne(boardId: number) {
		const responseDeletedBoardId = await this.boardsRepository
			.deleteBoardOne(boardId)
			.execute();

		return SuccessFulResponse(responseDeletedBoardId.raw.insertId);
	}
}
