import { HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { BoardsRepository } from "../database/repository/BoardRepository/boards.repository";
import { CoreResponseDto, SuccessFulResponse } from "../shared/CoreResponse";
import { UpdateBoardDto } from "../controller/board/board.controller.dto/update-board.dto";
import { CreateBoardDto } from "../controller/board/board.controller.dto/create-board.dto";
import { BoardsEntity } from "../database/entities/Board/Boards.entity";
import { DataSource, QueryRunner } from "typeorm";
import { transactionRunner } from "src/shared/common/transaction/transaction";
import { BoardImageEntity } from "src/database/entities/Board/BoardImage.entity";
import { UsersEntity } from "../database/entities/User/Users.entity";
import { HashtagService } from "./hashtag.service";
import { BoardImageService } from "./boardImage.service";

@Injectable()
export class BoardsService {
	constructor(
		private readonly boardsRepository: BoardsRepository,
		private readonly boardImageService: BoardImageService,
		private readonly hashTagService: HashtagService,
		private readonly dataSource: DataSource,
	) {}

	private async saveBoard(boardData, userId: number): Promise<BoardsEntity> {
		const newBoard = new BoardsEntity();
		Object.assign(newBoard, boardData);
		newBoard.user_id = userId;

		return await transactionRunner<BoardsEntity>(async (queryRunner: QueryRunner) => {
			return await queryRunner.manager.save(BoardsEntity, newBoard);
		}, this.dataSource);
	}

	async createBoard(data: CreateBoardDto, userId: number): Promise<CoreResponseDto> {
		const { boardHashTag, boardImages, ...boardData } = data;

		const savedBoard = await this.saveBoard(boardData, userId);
		const savedBoardHashTag = await this.hashTagService.saveBoardHashTags(boardHashTag, savedBoard.id);
		const createdImagePath = await this.boardImageService.saveBoardImages(boardImages, savedBoard.id);

		return SuccessFulResponse({
			board: savedBoard,
			hashTag: savedBoardHashTag,
			boardImages: createdImagePath,
		}, HttpStatus.CREATED);
	}

	async getBoardList(
		pageNumber: number,
		pageSize: number,
	) {
		const skip = (pageNumber - 1) * pageSize;
		const take = pageSize;

		const totalCount = await this.boardsRepository.count();
		const boards = await this.boardsRepository.find({
			select: {
				id: true,
				title: true,
				content: true,
				createdAt: true,
				User: {
					id: true,
					email: true,
					username: true,
				},
				boardHashTag: {
					id: true,
					hashtag: {
						id: true,
						name: true,
					}
				}
			},
			relations: ['User', 'boardHashTag', 'boardHashTag.hashtag'],
			order: { createdAt: 'DESC' },
			skip,
			take,
		});

		const totalPages = Math.ceil(totalCount / pageSize);

		return SuccessFulResponse({
			boards,
			pagination: {
				currentPage: pageNumber,
				pageSize,
				totalCount,
				totalPages,
			}
		});
	}

	async updateBoard(boardId: number, data: UpdateBoardDto, userEntity: UsersEntity) {
		const { boardHashTag, boardImages, ...boardData } = data;
		const foundBoard = await this.boardsRepository.findOneBy({
			id: boardId,
			user_id: userEntity.id,
		});

		if (!foundBoard) {
			throw new NotFoundException('해당하는 게시판이 없습니다.');
		}

		Object.assign(foundBoard, boardData);
		const updatedBoard = await transactionRunner(async (queryRunner: QueryRunner) => {
			return await queryRunner.manager.save(BoardsEntity, foundBoard);
		}, this.dataSource);

		if (boardImages && boardImages.length > 0) {
			await transactionRunner(async (queryRunner: QueryRunner) => {
				return await queryRunner.manager.softDelete(BoardImageEntity, { board_id: foundBoard.id });
			}, this.dataSource);

			for (const boardImage of boardImages) {
				// Existing code had no mutation for boardImage. Update here as necessary.
				console.log(boardImage);
			}
		}

		return SuccessFulResponse(updatedBoard);
	}

	async deleteBoardOne(boardId: number) {
		const deletedBoard = await this.boardsRepository.delete({ id: boardId });
		if (deletedBoard.affected > 0) return SuccessFulResponse(deletedBoard);
		else throw new NotFoundException('해당하는 게시판이 없습니다.');
	}
}