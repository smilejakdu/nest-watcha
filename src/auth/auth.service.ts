import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Users } from '../entities/Users';
import { log } from 'console';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(Users) private usersRepository: Repository<Users>,
	) {}

	async validateUser(nickname: string, password: string) {
		const user = await this.usersRepository.findOne({
			where: { nickname },
			select: ['id', 'nickname', 'password'],
		});
		// console.log(nickname, password, user);
		log(nickname, password, user); // user 안에 id 가 들어있어야한다.
		if (!user) {
			return null;
		}
		const result = await bcrypt.compare(password, user.password);
		if (result) {
			const { password, ...userWithoutPassword } = user;
			// delete user.password; // 이런식으로 password 만 빼서 전달해도 된다.
			return userWithoutPassword;
		}
		return null;
	}
}
