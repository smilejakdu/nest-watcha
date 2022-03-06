import bcrypt from 'bcrypt';
import { isNil } from 'lodash';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// Entity
import { UsersEntity } from '../entities/UsersEntity';

export interface UserFindOneOptions {
	id?: number;
	nickname?: string;
}

@Injectable()
export class UsersService {
	constructor(@InjectRepository(UsersEntity) private usersRepository: Repository<UsersEntity>) {}

	async findByNickname(data : UserFindOneOptions) {
		const { id , nickname}= data;
		const qb = await UsersEntity.makeQueryBuilder().leftJoinAndSelect('users.Board','boards');
		if (id) qb.andWhere('user.id = :id', { id });
		if (nickname) qb.andWhere('user.nickname = :nickname', { nickname });

		return qb.getOne();
	}

	async signUp(nickname: string, password: string): Promise<UsersEntity> {
		const hashedPassword = await bcrypt.hash(password, 12);
		const user = await UsersEntity.findByNickname(nickname).getOne();

		if (user) {
			throw new Error('이미 존재하는 사용자');
		}

		const createUser = await this.usersRepository.save({
			nickname,
			password: hashedPassword,
		});
		delete createUser.password;

		return createUser;
	}

	async logIn(nickname: string, password: string): Promise<UsersEntity | string> {
		const foundUser = await this.usersRepository.createQueryBuilder('user').where('user.nickname =:nickname', { nickname }).getOne();

		if (isNil(foundUser)) {
			throw new Error('존재하지 않는 사용자 입니다.');
		}

		const result = await bcrypt.compare(password, foundUser.password);

		if (result) {
			delete foundUser.password;
			return foundUser;
		}

		return '비밀번호가 틀립니다.';
	}
}
