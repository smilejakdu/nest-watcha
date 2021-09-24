import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashTag } from 'src/entities/HashTag';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';
import { Boards } from 'src/entities/Boards';

@Injectable()
export class HashtagService {
	constructor(
		@InjectRepository(HashTag) private hashtagRepository: Repository<HashTag>,
		@InjectRepository(Boards) private boardRepository: Repository<Boards>,
	) {}

	async getMyHashTag(hashtag: string[]): Promise<object> {
		return this.boardRepository
			.createQueryBuilder('board')
			.select(
				`
				board.* from boards	
			`,
			)
			.innerJoin('board.hashTag', 'hashtag', 'hashtag.id = :BoardId', {})
			.innerJoin('hashtag.boards', 'boards', 'boards.id = :BoardId', {})
			.where('hashtag.hash=:(...hashtag)', { hashtag })
			.groupBy('board.id')
			.getMany();
	}
}
// select boards.* from boards
// inner join hashtag as h inner join boardhashtag as bht where h.hash in ("노드","test") group by boards.id;
