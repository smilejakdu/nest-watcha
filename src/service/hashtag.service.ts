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

	// 이미 데이터베이스에 있는 해시태그는 재사용하고, 없는 해시태그는 새로 생성합니다.
	async saveBoardHashTags(boardHashTag: string[], boardId: number) {
		if (!boardHashTag?.length) return;

		const existingHashTags = await this.getHashTagList(boardHashTag);
		// 만약 위의 코드에서 existingHashTags 가 중복된 코드를 제거하려면 new Set 을 사용하면 됩니다.
		const existingHashTagNames = existingHashTags.map((hashTag) => hashTag.name);

		// 데이터베이스에 없는 해시태그만 필터링합니다.
		const tagsToCreate = boardHashTag.filter((hashTag) => !existingHashTagNames.includes(hashTag));
		// 선택된 해시태그를 데이터베이스에 새로 저장한다.
		const createdHashTags = await Promise.all(tagsToCreate.map(tag => this.saveHashTag(tag, boardId)));
		console.log(createdHashTags)
		// 기존 해시태그와 새로 생성된 해시태그를 모두 합칩니다.
		const allHashTags = [...existingHashTags, ...createdHashTags];
		// 모든 해시태그를 해당 게시판에 연결합니다
		return await Promise.all(allHashTags.map(hashTag => this.saveHashTag(hashTag, boardId)));
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
