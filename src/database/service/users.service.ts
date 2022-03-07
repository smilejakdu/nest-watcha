import bcrypt from 'bcrypt';
import { isNil } from 'lodash';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// Entity
import { UsersEntity } from '../entities/UsersEntity';
import { SignUpRequestDto } from '../../controller/users/users.controller.dto/signUpDto/signUp.request.dto';

export interface UserFindOneOptions {
	id?: number;
	username?: string;
}

@Injectable()
export class UsersService {
	constructor(@InjectRepository(UsersEntity) private usersRepository: Repository<UsersEntity>) {}

	async findByUsername(data : UserFindOneOptions) {
		const { id , username}= data;
		const qb = await UsersEntity.makeQueryBuilder().leftJoinAndSelect('users.Board','boards');
		if (id) qb.andWhere('user.id = :id', { id });
		if (username) qb.andWhere('user.username = :username', { username });

		return qb.getOne();
	}

	async kakaoSignUp(signUpDto :SignUpRequestDto){
		const createUser = await this.usersRepository.save(signUpDto);
		delete createUser.password;
		return createUser;
	}

	async signUp(signUpDto :SignUpRequestDto): Promise<UsersEntity> {
		const {password , username}= signUpDto;
		const hashedPassword = await bcrypt.hash(password, 12);
		const user = await UsersEntity.findByUsername(username).getOne();

		if (user) {
			throw new Error('이미 존재하는 사용자');
		}

		const createUser = await this.usersRepository.save({
			username,
			password: hashedPassword,
		});
		delete createUser.password;

		return createUser;
	}

	async logIn(username: string, password: string): Promise<UsersEntity | string> {
		const foundUser = await this.usersRepository.createQueryBuilder('user').where('user.username =:username', { username }).getOne();

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
