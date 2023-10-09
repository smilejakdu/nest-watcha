import { Injectable } from "@nestjs/common";
// Entity
import { BoardHashTagEntity } from "../database/entities/Board/BoardHashTag.entity";
import { BoardsRepository } from "../database/repository/BoardRepository/boards.repository";
import { HashtagRepository } from "../database/repository/hashtag.repository";
import { SuccessFulResponse } from "../shared/CoreResponse";
import { BoardImageRepository } from "src/database/repository/BoardRepository/boardImage.repository";
import {transactionRunner} from "../shared/common/transaction/transaction";
import {DataSource} from "typeorm";

@Injectable()
export class HashtagService {
	constructor(
		private readonly boardsRepository: BoardsRepository,
		private readonly boardImageRepository: BoardImageRepository,
		private readonly hashTagRepository: HashtagRepository,
		private readonly dataSource: DataSource,
	) {}

	async getMyHashTag(hashtag: string| string[]) {
		const responseBoard = this.boardsRepository
			.makeQueryBuilder()
			.select()
			.addSelect([
				'boardHashTag.id',
			])
			.addSelect([
				'hashtag.id',
				'hashtag.name',
			])
			.innerJoin('boards.boardHashTag', 'boardHashTag')
			.innerJoin('boardHashTag.hashtag', 'hashtag');

		if (typeof hashtag === 'string') {
			responseBoard.where('hashtag.name =: hashtag', { hashtag });
		} else {
			responseBoard.where('hashtag.name in (:names)', { names: hashtag })
		}

		const result = await responseBoard.getMany();
		return SuccessFulResponse(result);
	}

	async getHashTagList(hashTagList: string[]) {
		return await this.hashTagRepository.findHashTagList(hashTagList)
	}

	async insertHashtagList(hashTagList) {
		return await this.hashTagRepository.insertHashtagList(hashTagList);
	}

	async saveHashTag(hashTag, boardId: number) {
		const newBoardHashTag = new BoardHashTagEntity();
		newBoardHashTag.board_id = boardId;
		newBoardHashTag.hash_id = hashTag.id;

		return await transactionRunner(async (queryRunner) => {
			return await queryRunner.manager.save(BoardHashTagEntity, newBoardHashTag);
		}, this.dataSource);
	}
}
