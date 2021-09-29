import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { Users } from 'src/entities/Users';
import { log } from 'console';

@Injectable()
export class UsersService {
	constructor(@InjectRepository(Users) private usersRepository: Repository<Users>) {}

	async findByNickname(nickname: string) {
		return this.usersRepository.findOne({
			where: { nickname },
			select: ['id', 'nickname', 'password'],
		});
	}

	getUser() {}

	async signUp(nickname: string, password: string) {
		const hashedPassword = await bcrypt.hash(password, 12);
		const user = await this.usersRepository.findOne({ where: { nickname } });
		log("signup user : " , user)
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
