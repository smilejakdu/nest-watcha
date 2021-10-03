import { size, isEmpty } from 'lodash';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { HashTag } from '../../src/entities/HashTag';
import { BoardHashTag } from '../../src/entities/BoardHashTag';
import { Boards } from '../../src/entities/Boards';

@Injectable()
export class HashtagService {
	constructor(
		@InjectRepository(Boards) private boardRepository: Repository<Boards>,
		@InjectRepository(HashTag) private hashTagRepository: Repository<HashTag>,
		@InjectRepository(BoardHashTag)
		private boardHashTagRepository: Repository<BoardHashTag>,
	) {}

	async getMyHashTag(hashtag: string[]): Promise<object> {
		return this.boardRepository
			.createQueryBuilder('Boards')
			.select('Boards.*')
			.innerJoin(BoardHashTag, 'BoardHashTag', 'BoardHashTag.BoardId = Boards.id')
			.innerJoin(HashTag, 'HashTag', 'HashTag.id = BoardHashTag.HashId')
			.where('HashTag.hash IN (:...hashtag)', { hashtag })
			.groupBy('Boards.id')
			.getRawMany();
	}

	async insertHashtagList(hashTagList) {
		const hashtagInsertedList = await this.hashTagRepository
			.createQueryBuilder('hashtag')
			.insert()
			.values(hashTagList)
			.execute();
		return hashtagInsertedList;
	}

	async createHashTag(boardId: number, hashtag: string) {
		const BoardIdhashId: any[] = [];

		const hashtags: string[] = hashtag.match(/#[^\s#]+/g);
		if (!isEmpty(hashtags)) {
			const HashSliceLowcase: string[] = hashtags.map((v: string) => v.slice(1).toLowerCase());
			console.log('HashSliceLowcase : ', HashSliceLowcase);
			const hashEntityList: HashTag[] = await this.hashTagRepository
				.createQueryBuilder('hashtag')
				.select(['hashtag.id', 'hashtag.hash'])
				.where('hashtag.hash IN (:...HashSliceLowcase)', { HashSliceLowcase })
				.getMany();

			const hashTagResultList = hashEntityList.map(hashtag => {
				return hashtag.hash;
			});

			if (isEmpty(hashEntityList)) {
				const hashList = hashTagResultList.map(function (hashtag) {
					return { hash: hashtag };
				});
				const hashtagInsertedList = await this.insertHashtagList(hashList);

				for (const hashTag of hashtagInsertedList.identifiers) {
					BoardIdhashId.push({ BoardId: boardId, HashId: hashTag.id });
				}

			} else {
				const differenceHash = HashSliceLowcase.filter(value => !hashTagResultList.includes(value.));
				// 아직 hash table 에 존재하지 않는 hash
			}

			const differenceHash = HashSliceLowcase.filter(value => !hashTagResultList.includes(value));
			// 아직 hash table 에 존재하지 않는 hash

			if (isEmpty(hashTagResultList)) {
				//
				const hashList = hashTagResultList.map(function (hashtag) {
					return { hash: hashtag };
				});

				const hashtagInsertedList = await this.insertHashtagList(hashList);

				for (const hashTag of hashtagInsertedList.identifiers) {
					BoardIdhashId.push({ BoardId: boardId, HashId: hashTag.id });
				}
			} else {
			}
		}
	}
}
