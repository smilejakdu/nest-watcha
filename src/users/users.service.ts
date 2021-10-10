import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import bcrypt from 'bcrypt';
import { pickBy, isNil, negate } from 'lodash';

import { Users } from '../entities/Users';
import { log } from 'console';
import { pbkdf2 } from 'crypto';

export interface UserFindOneOptions {
	id?: number;
	nickname?: string;
}

@Injectable()
export class UsersService {
	constructor(@InjectRepository(Users) private usersRepository: Repository<Users>) {}

	async findByNickname({ id, nickname }: UserFindOneOptions = {}) {
		const qb = this.usersRepository.createQueryBuilder('user').leftJoinAndSelect('user.UserToBoards', 'userBoards');

		if (id) qb.andWhere('user.id = :id', { id });
		if (nickname) qb.andWhere('user.nickname = :nickname', { nickname });

		return qb.getOne();
	}

	async signUp(nickname: string, password: string) {
		const hashedPassword = await bcrypt.hash(password, 12);
		const user = await this.usersRepository.findOne({ where: { nickname } });

		if (user) {
			throw new Error('이미 존재하는 사용자');
		}

		const createUser = await this.usersRepository.save({
			nickname,
			password: hashedPassword,
		});
		return createUser;
	}
}
