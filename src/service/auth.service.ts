import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UsersEntity } from '../entities/UsersEntity';

@Injectable()
export class AuthService {
	constructor(@InjectRepository(UsersEntity) private usersRepository: Repository<UsersEntity>) {}

	async validateUser(nickname: string, password: string) {
		const user = await this.usersRepository.findOne({
			where: { nickname },
			select: ['id', 'nickname', 'password'],
		});
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
