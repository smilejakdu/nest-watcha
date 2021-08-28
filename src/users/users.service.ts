import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { Users } from 'src/entities/Users';

@Injectable()
export class UsersService {
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
			return false;
		}
		const createUser = await this.usersRepository.save({
			nickname,
			password: hashedPassword,
		});
		return createUser;
	}
}
