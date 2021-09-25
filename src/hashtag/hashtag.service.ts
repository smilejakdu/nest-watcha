import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { HashTag } from '../../src/entities/HashTag';
import { BoardHashTag } from '../../src/entities/BoardHashTag';
import { Boards } from '../../src/entities/Boards';

@Injectable()
export class HashtagService {
	constructor(@InjectRepository(Boards) private boardRepository: Repository<Boards>) {}

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
}
