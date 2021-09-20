import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashTag } from 'src/entities/HashTag';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';

@Injectable()
export class HashtagService {
	constructor(@InjectRepository(HashTag) private hashtagRepository: Repository<HashTag>) {}

	async getMyHashTag(hashtag: string[]): Promise<object> {
		return this.hashtagRepository
			.createQueryBuilder('hashtag')
			.select()
			.addSelect('SUM(hashtag.hash)', 'sum')
			.innerJoin('hashtag.boards', 'boards', 'boards.id = :BoardId', {})
			.where('hashtag.hash=:hash', { hash: hashtag })
			.getMany();
	}
}
