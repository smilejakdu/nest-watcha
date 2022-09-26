import { isEmpty } from 'lodash';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// Entity
import { HashTagEntity } from '../database/entities/hashTag.entity';
import { BoardHashTagEntity } from '../database/entities/Board/BoardHashTag.entity';
import { BoardsRepository } from '../database/repository/BoardRepository/boards.repository';
import { HashtagRepository } from '../database/repository/hashtag.repository';

@Injectable()
export class HashtagService {
	constructor(
		private readonly boardsRepository: BoardsRepository,
		private readonly hashTagRepository: HashtagRepository,
		@InjectRepository(BoardHashTagEntity)
		private readonly boardHashTagRepository: Repository<BoardHashTagEntity>,
	) {}

	async getMyHashTag(hashtag: string[]): Promise<any> {
		return this.boardsRepository
			.createQueryBuilder('Boards')
			.select('Boards.*')
			.addSelect([
				'HashTag.id',
				'HashTag.hash',
			])
			.innerJoin(BoardHashTagEntity, 'BoardHashTag', 'BoardHashTag.boardId = Boards.id')
			.innerJoin(HashTagEntity, 'HashTag', 'HashTag.id = BoardHashTag.hashId')
			.where('HashTag.hash IN (:...hashtag)', { hashtag })
			.groupBy('Boards.id')
			.getRawMany();
	}

	async insertHashtagList(hashTagList) {
		const hashtagInsertedList = await this.hashTagRepository.insertHashtagList(hashTagList);
		return hashtagInsertedList;
	}

	async createHashTag(boardId: number, hashtag: string) {
		const BoardIdhashId: any[] = [];

		const hashtags: string[] = hashtag.match(/#[^\s#]+/g);
		if (!isEmpty(hashtags)) {
			const HashSliceLowcase: string[] = hashtags.map((v: string) => v.slice(1).toLowerCase());
			const hashEntityList: HashTagEntity[] = await this.hashTagRepository
				.findHashTagList(HashSliceLowcase);

			const hashTagResultList = hashEntityList.map(hashtag => {
				return hashtag.hash;
			});

			if (isEmpty(hashEntityList)) {
				const hashList = hashTagResultList.map(function (hashtag) {
					return { hash: hashtag };
				});
				const hashtagInsertedList = await this.insertHashtagList(hashList);

				for (const hashTag of hashtagInsertedList.identifiers) {
					BoardIdhashId.push({ boardId: boardId, hashId: hashTag.id });
				}
			} else {
				const differenceHash = HashSliceLowcase.filter(value => !hashTagResultList.includes(value));
				const differencehashList = differenceHash.map(function (hashtag) {
					return { hash: hashtag };
				});
				const hashtagInsertedList = await this.insertHashtagList(differencehashList);

				for (const hashTag of hashtagInsertedList.identifiers) {
					BoardIdhashId.push({ boardId: boardId, hashId: hashTag.id });
				}

				for (const hashTag of hashEntityList) {
					BoardIdhashId.push({ boardId: boardId, hashId: hashTag.id });
				}

				await this.boardHashTagRepository
					.createQueryBuilder('boardHashTag')
					.insert()
					.values(BoardIdhashId).execute();
			}
		}
	}
}
