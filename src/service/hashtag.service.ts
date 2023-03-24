import { isEmpty } from "lodash";
import { Injectable } from "@nestjs/common";
// Entity
import { HashTagEntity } from "../database/entities/hashTag.entity";
import { BoardHashTagEntity } from "../database/entities/Board/BoardHashTag.entity";
import { BoardsRepository } from "../database/repository/BoardRepository/boards.repository";
import { HashtagRepository } from "../database/repository/hashtag.repository";
import { SuccessFulResponse } from "../shared/CoreResponse";
import {response} from "express";

@Injectable()
export class HashtagService {
	constructor(
		private readonly boardsRepository: BoardsRepository,
		private readonly hashTagRepository: HashtagRepository,
	) {}

	async getMyHashTag(hashtag: string[]) {
		const responseBoard = await this.boardsRepository
			.makeQueryBuilder()
			.select('boards.*')
			.addSelect([
				'HashTag.id',
				'HashTag.name',
			])
			.innerJoin(BoardHashTagEntity, 'BoardHashTag', 'BoardHashTag.board_id = boards.id')
			.innerJoin(HashTagEntity, 'hashTag', 'hashTag.id = BoardHashTag.hash_id')

		if (typeof hashtag === 'string') {
			responseBoard.where('hashTag.name = :hashtag', { hashtag });
		} else {
			responseBoard.where('hashTag.name IN (:...hashtag)', { hashtag })
		}
		responseBoard.groupBy('boards.id')
		.getRawMany();

		return SuccessFulResponse(responseBoard);
	}

	async insertHashtagList(hashTagList) {
		return await this.hashTagRepository.insertHashtagList(hashTagList);
	}

	async createHashTag(boardId: number, hashtag: string) {
		const BoardIdhashId: { board_id: number, hash_id: number }[] = [];

		const hashtags: string[] = hashtag.match(/#[^\s#]+/g);
		if (!isEmpty(hashtags)) {
			const HashSliceLowcase: string[] = hashtags.map((v: string) => v.slice(1).toLowerCase());
			const hashEntityList: HashTagEntity[] = await this.hashTagRepository
				.findHashTagList(HashSliceLowcase);

			const hashTagResultList = hashEntityList.map(hashtag => {
				return hashtag.name
			});

			if (isEmpty(hashEntityList)) {
				const hashList = hashTagResultList.map(function (hashtag) {
					return { hash: hashtag };
				});
				const hashtagInsertedList = await this.insertHashtagList(hashList);

				for (const hashTag of hashtagInsertedList.identifiers) {
					BoardIdhashId.push({ board_id: boardId, hash_id: hashTag.id });
				}
			} else {
				const differenceHash = HashSliceLowcase.filter(value => !hashTagResultList.includes(value));
				const differencehashList = differenceHash.map(function (hashtag) {
					return { hash: hashtag };
				});
				const hashtagInsertedList = await this.insertHashtagList(differencehashList);

				for (const hashTag of hashtagInsertedList.identifiers) {
					BoardIdhashId.push({ board_id: boardId, hash_id: hashTag.id });
				}

				for (const hashTag of hashEntityList) {
					BoardIdhashId.push({ board_id: boardId, hash_id: hashTag.id });
				}

				await BoardHashTagEntity
					.makeQueryBuilder()
					.insert()
					.values(BoardIdhashId).execute();
			}
		}
	}
}
