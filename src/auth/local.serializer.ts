import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities/Users';
import { AuthService } from './auth.service';

@Injectable()
export class LocalSerializer extends PassportSerializer {
	constructor(
		private readonly authService: AuthService,
		@InjectRepository(Users) private usersRepository: Repository<Users>,
	) {
		super();
	}

	serializeUser(user: Users, done: CallableFunction) {
		console.log(user);
		done(null, user.id); // session id 만 여기다가 저장이 된다.
	}

	async deserializeUser(userId: string, done: CallableFunction) {
		return await this.usersRepository
			.findOneOrFail({
				id: +userId,
			})
			.then(user => {
				console.log('user', user);
				done(null, user); // req.user 가 된다.
			})
			.catch(error => done(error));
	}
}
