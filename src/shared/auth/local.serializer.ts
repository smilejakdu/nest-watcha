import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from '../../database/entities/UsersEntity';
import { AuthService } from '../../database/service/auth.service';

@Injectable()
export class LocalSerializer extends PassportSerializer {
	constructor(
		private readonly authService: AuthService,
		@InjectRepository(UsersEntity) private usersRepository: Repository<UsersEntity>,
	) {
		super();
	}

	serializeUser(user: UsersEntity, done: CallableFunction) {
		done(null, user.id); // session id 만 여기다가 저장 user.id
	}
	// session 에 저장되어있는 id 바탕으로 user 정보 가져오게 된다.
	async deserializeUser(userId: string, done: CallableFunction) {
		return await this.usersRepository
			.findOneOrFail({ id: +userId }, { select: ['id', 'nickname'] })
			.then(user => {
				done(null, user); // req.user 가 된다.
			})
			.catch(error => done(error));
	}
}