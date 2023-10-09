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

	private async saveBoard(boardData, userId: number): Promise<BoardsEntity> {
		const newBoard = new BoardsEntity();
		Object.assign(newBoard, boardData);
		newBoard.user_id = userId;

		return await transactionRunner<BoardsEntity>(async (queryRunner: QueryRunner) => {
			return await queryRunner.manager.save(BoardsEntity, newBoard);
		}, this.dataSource);
	}

	private async saveBoardHashTag(hashTag, boardId: number) {
		const newBoardHashTag = new BoardHashTagEntity();
		newBoardHashTag.board_id = boardId;
		newBoardHashTag.hash_id = hashTag.id;

		return await transactionRunner(async (queryRunner) => {
			return await queryRunner.manager.save(BoardHashTagEntity, newBoardHashTag);
		}, this.dataSource);
	}

	private async saveNewHashTag(hashTag: string) {
		const newHashTag = new HashTagEntity();
		newHashTag.name = hashTag;

		return transactionRunner(async (queryRunner) => {
			return queryRunner.manager.save(HashTagEntity, newHashTag);
		}, this.dataSource);
	}

	// 이미 데이터베이스에 있는 해시태그는 재사용하고, 없는 해시태그는 새로 생성합니다.
	private async saveBoardHashTags(boardHashTag: string[], boardId: number) {
		if (!boardHashTag?.length) return;

		const existingHashTags = await this.hashTagRepository.findHashTagList(boardHashTag);
		// 만약 위의 코드에서 existingHashTags 가 중복된 코드를 제거하려면 new Set 을 사용하면 됩니다.
		const existingHashTagNames = existingHashTags.map((hashTag) => hashTag.name);

		// 데이터베이스에 없는 해시태그만 필터링합니다.
		const tagsToCreate = boardHashTag.filter((hashTag) => !existingHashTagNames.includes(hashTag));
		// 선택된 해시태그를 데이터베이스에 새로 저장한다.
		const createdHashTags = await Promise.all(tagsToCreate.map(tag => this.saveNewHashTag(tag)));
		console.log(createdHashTags)
		// 기존 해시태그와 새로 생성된 해시태그를 모두 합칩니다.
		const allHashTags = [...existingHashTags, ...createdHashTags];
		// 모든 해시태그를 해당 게시판에 연결합니다
		return await Promise.all(allHashTags.map(hashTag => this.saveBoardHashTag(hashTag, boardId)));
	}

	private async saveBoardImages(images: string[], boardId: number) {
		if (!images?.length) return null;

		return await Promise.all(images.map(async (image) => {
			const boardImage = new BoardImageEntity();
			boardImage.board_id = boardId;
			boardImage.imagePath = image;
			return await transactionRunner(async (queryRunner: QueryRunner) => {
				return await queryRunner.manager.save(BoardImageEntity, boardImage);
			}, this.dataSource);
		}));
	}

	async createBoard(data: CreateBoardDto, userId: number): Promise<CoreResponseDto> {
		const {boardHashTag, boardImages , ...boardData} = data;

		const savedBoard = await this.saveBoard(boardData, userId);
		const savedBoardHashTag = await this.saveBoardHashTags(boardHashTag, savedBoard.id);
		const createdImagePath = await this.saveBoardImages(boardImages, savedBoard.id);

		return SuccessFulResponse({
			board : savedBoard,
			hashTag: savedBoardHashTag,
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
