import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
// Entity
import { UsersEntity } from '../entities/UsersEntity';

export interface UserFindOneOptions {
	id?: number;
	nickname?: string;
}

@Injectable()
export class UsersService {
	constructor(@InjectRepository(UsersEntity) private usersRepository: Repository<UsersEntity>) {}

	async findByNickname({ id, nickname }: UserFindOneOptions = {}) {
		const qb = this.usersRepository.createQueryBuilder('user').leftJoinAndSelect('user.Board', 'boards');

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
