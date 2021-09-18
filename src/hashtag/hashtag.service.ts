import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashTag } from 'src/entities/HashTag';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';

@Injectable()
export class HashtagService {
	constructor(
		@InjectRepository(HashTag) private boardsRepository: Repository<HashTag>,
		@InjectRepository(Users) private usersRepository: Repository<Users>,
	) {}

  async getMyHashTag(UserId: number , hashtag:string):Promise<object> {
    return
  }
}
