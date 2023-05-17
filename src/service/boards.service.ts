import { HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { BoardsRepository } from "../database/repository/BoardRepository/boards.repository";
import { CoreResponseDto, SuccessFulResponse } from "../shared/CoreResponse";
import { UpdateBoardDto } from "../controller/board/board.controller.dto/update-board.dto";
import { CreateBoardDto } from "../controller/board/board.controller.dto/create-board.dto";
import { BoardsEntity } from "../database/entities/Board/Boards.entity";
import { DataSource, QueryRunner } from "typeorm";
import { transactionRunner } from "src/shared/common/transaction/transaction";
import { HashtagRepository } from "../database/repository/hashtag.repository";
import { BoardHashTagEntity } from "../database/entities/Board/BoardHashTag.entity";
import { BoardImageEntity } from "src/database/entities/Board/BoardImage.entity";
import { HashTagEntity } from "../database/entities/hashTag.entity";
import { UsersEntity } from "../database/entities/User/Users.entity";
import { BoardImageRepository } from "../database/repository/BoardRepository/boardImage.repository";
import solr from "solr-node";

@Injectable()
export class BoardsService {
	private solrNodeclient;
	constructor(
		private readonly boardsRepository: BoardsRepository,
		private readonly boardImageRepository: BoardImageRepository,
		private readonly hashTagRepository: HashtagRepository,
		private readonly dataSource: DataSource,
	) {
		this.solrNodeclient = new solr({
			host: 'localhost',
			port: '8983',
			core: 'board',
			protocol: 'http',
		});
	}

	async createBoard(data: CreateBoardDto, userId: number): Promise<CoreResponseDto> {
		const {boardHashTag, boardImages , ...boardData} = data;

		const newBoard = new BoardsEntity();
		Object.assign(newBoard, boardData);
		newBoard.user_id = userId;
		const createdBoard = await transactionRunner<BoardsEntity>(async (queryRunner:QueryRunner) => {
			return await queryRunner.manager.save(BoardsEntity, newBoard);
		}, this.dataSource);

		let createdBoardHashTag;
		if (boardHashTag?.length > 0) {
			const foundHashTagList = await this.hashTagRepository.findHashTagList(boardHashTag);
			if (foundHashTagList.length > 0) {
				createdBoardHashTag = foundHashTagList.map(async (hashTag) => {
					const newBoardHashTag = new BoardHashTagEntity();
					newBoardHashTag.board_id = createdBoard.id;
					newBoardHashTag.hash_id = hashTag.id;
					return await transactionRunner(async (queryRunner) => {
						return await queryRunner.manager.save(BoardHashTagEntity, newBoardHashTag);
					}, this.dataSource);
				});
			} else {
				const newHashTagList = boardHashTag.map(async (hashTag) => {
					const newHashTag = new HashTagEntity();
					newHashTag.name = hashTag;
					return transactionRunner(async (queryRunner) => {
						return queryRunner.manager.save(HashTagEntity, newHashTag);
					},this.dataSource);
				});
				createdBoardHashTag = await Promise.all(newHashTagList);
				createdBoardHashTag = await createdBoardHashTag.map(async (hashTag) => {
					const newBoardHashTag = new BoardHashTagEntity();
					newBoardHashTag.board_id = createdBoard.id;
					newBoardHashTag.hash_id = hashTag.id;
					return await transactionRunner(async (queryRunner) => {
						return await queryRunner.manager.save(BoardHashTagEntity, newBoardHashTag);
					},this.dataSource);
				});
			}
		}

		let createdImagePath;
		if (boardImages?.length > 0) {
			createdImagePath = boardImages.map(async (image) => {
				const newBoardImage = new BoardImageEntity();
				newBoardImage.board_id = createdBoard.id;
				newBoardImage.imagePath = image;
				return await transactionRunner(async (queryRunner) => {
					return await queryRunner.manager.save(BoardImageEntity, newBoardImage);
				}, this.dataSource);
			});
		}

		return SuccessFulResponse({
			board : createdBoard,
			hashTag: createdBoardHashTag,
			boardImages : createdImagePath,
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
					hashtag:{
						id: true,
						name: true,
					}
				}
			},
			relations: ['User', 'boardHashTag','boardHashTag.hashtag'],
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

	async searchBoardBySorl(query: string) {
		try {
			const result = await this.solrNodeclient.query().q(query);
			const responseSearch = await this.solrNodeclient.search(result);
			return JSON.stringify(responseSearch);
		} catch (err) {
			throw err;
		}
	}

	async updateBoard(boardId: number, data: UpdateBoardDto, user_entitiy:UsersEntity) {
		const { boardHashTag, boardImages, ...boardData } = data;
		const foundBoard = await this.boardsRepository.findOneBy({
			id:boardId,
			user_id: user_entitiy.id,
		});

		if(!foundBoard) {
			throw new NotFoundException('해당하는 게시판이 없습니다.');
		}

		Object.assign(foundBoard, boardData);
		const updatedBoard = await transactionRunner(async (queryRunner:QueryRunner)=>{
			return await queryRunner.manager.save(BoardsEntity,foundBoard);
		}, this.dataSource);

		if (boardImages.length > 0) {
			await transactionRunner(async (queryRunner:QueryRunner) => {
				return await queryRunner.manager.softDelete(BoardImageEntity,{board_id:foundBoard.id});
			}, this.dataSource);

			for (const boardImage of boardImages) {
				console.log(boardImage);
			}
		}

		return SuccessFulResponse(updatedBoard);
	}

	async deleteBoardOne(boardId: number) {
		const foundBoard = await this.boardsRepository.findOneBy({id:boardId});

		if (!foundBoard) {
			throw new NotFoundException('해당하는 게시판이 없습니다.');
		}

		const deletedBoard = await transactionRunner(async (queryRunner:QueryRunner) => {
			return await queryRunner.manager.softDelete(BoardsEntity,{id:foundBoard});
		}, this.dataSource);

		return SuccessFulResponse(deletedBoard);
	}
}
