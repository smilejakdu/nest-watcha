import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { Users } from 'src/entities/Users';

@Injectable()
export class UsersService {
	// 비지니스 로직인 서비스랑 테이블 entity 사이를 Repositoy 가 이어준다.
	constructor(@InjectRepository(Users) private usersRepository: Repository<Users>) {}

	async findByEmail(nickname: string) {
		return this.usersRepository.findOne({
			where: { nickname },
			select: ['id', 'nickname', 'password'],
		});
	}

	getUser() {}

	async signUp(nickname: string, password: string) {
		const hashedPassword = await bcrypt.hash(password, 12);
		const user = await this.usersRepository.findOne({ where: { nickname } });
		if (user) {
			throw new Error('이미 존재하는 사용자');
			// return false;
		}
		const createUser = await this.usersRepository.save({
			nickname,
			password: hashedPassword,
		});
		return createUser;
	}
}
