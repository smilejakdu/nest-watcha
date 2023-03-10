import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { BoardsRepository } from '../database/repository/BoardRepository/boards.repository';
import { CoreResponse, SuccessFulResponse } from '../shared/CoreResponse';
import { Pagination } from '../shared/pagination';
import { UpdateBoardDto } from '../controller/board/board.controller.dto/update-board.dto';
import {CreateBoardDto} from "../controller/board/board.controller.dto/create-board.dto";
import {BoardsEntity} from "../database/entities/Board/Boards.entity";
import {QueryRunner} from "typeorm";
import { transactionRunner } from 'src/shared/common/transaction/transaction';

@Injectable()
export class BoardsService {
	constructor(
		private readonly boardsRepository: BoardsRepository,
	) { }

	async createBoard(data: CreateBoardDto, userId: number):Promise<CoreResponse> {
		const createdBoard = await this.boardsRepository.createBoard(data, userId);

		if(!createdBoard) {
			throw new BadRequestException('BAD REQUEST');
		}

		return SuccessFulResponse(createdBoard, HttpStatus.CREATED);
	}

	async findAllBoards(pageNumber: number):Promise<CoreResponse> {
		const foundAllBoards = await this.boardsRepository.findAllBoards(pageNumber);
		return SuccessFulResponse(foundAllBoards);
	}

	async updateBoard(boardId: number, data: UpdateBoardDto) {
		const foundBoard = await this.boardsRepository.findOneBy({id:boardId});

		if(!foundBoard){
			throw new NotFoundException('해당하는 게시판이 없습니다.');
		}

		Object.assign(foundBoard, data);
		const updatedBoard = await this.boardsRepository.update(foundBoard.id, data);

		return SuccessFulResponse(updatedBoard);
	}

	async deleteBoardOne(boardId: number) {
		const foundBoard = await this.boardsRepository.findOneBy({id:boardId});
		if (!foundBoard) {
			throw new NotFoundException('해당하는 게시판이 없습니다.');
		}

		const deletedBoard = await transactionRunner(async (queryRunner:QueryRunner) => {
			return await queryRunner.manager.softDelete(BoardsEntity,{id:foundBoard});
		});

		return SuccessFulResponse(deletedBoard);
	}
}
