import { Injectable } from '@nestjs/common';
// Entity
import { SignUpRequestDto } from '../../controller/users/users.controller.dto/signUpDto/signUp.request.dto';
import { UserRepository } from '../repository/user.repository';
import { LoginRequestDto } from '../../controller/users/users.controller.dto/logInDto/logIn.request.dto';

export interface UserFindOneOptions {
	id?: number;
	username?: string;
}

@Injectable()
export class UsersService {
	constructor(
		private readonly userRepository : UserRepository,
	) {}

	async findByUsername(data : UserFindOneOptions) {
		return await this.userRepository.findByUsername(data);
	}

	async signUp(signUpDto :SignUpRequestDto) {
		return await this.userRepository.signUp(signUpDto);
	}

	async logIn(logInDto:LoginRequestDto) {
		return await this.userRepository.logIn(logInDto);
	}

	// async kakaoSignUp(signUpDto :SignUpRequestDto){
	// 	const createUser = await this.usersRepository.save(signUpDto);
	// 	delete createUser.password;
	// 	return createUser;
	// }
}
