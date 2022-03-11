import { HttpStatus, Injectable } from '@nestjs/common';
// Entity
import { SignUpRequestDto } from '../../controller/users/users.controller.dto/signUpDto/signUp.request.dto';
import { UserRepository } from '../repository/user.repository';
import { CoreResponse } from '../../shared/CoreResponse';
import { LoginRequestDto } from '../../controller/users/users.controller.dto/logInDto/logIn.request.dto';
import bcrypt from 'bcrypt';
import * as Jwt from 'jsonwebtoken';
import { isNil } from 'lodash';


export interface UserFindOneOptions {
	id?: number;
	username?: string;
}

@Injectable()
export class UsersService {
	constructor(
		private readonly userRepository: UserRepository,
	) {}

	async findByUsername(data: UserFindOneOptions): Promise<CoreResponse> {
		const responseUser = await this.userRepository.findByUsername(data);
		if (isNil(responseUser)) {
			return {
				ok: false,
				statusCode: HttpStatus.NOT_FOUND,
				message: 'NOT_FOUND_USER',
			};
		}
		return {
			ok: true,
			statusCode: HttpStatus.OK,
			message: 'SUCCESS',
			data: responseUser,
		};
	}

	async signUp(signUpDto: SignUpRequestDto) {
		const { password, username, email, phone } = signUpDto;
		const foundUser = await this.userRepository.findByUsername({ username: username });
		if (isNil(foundUser)) {
			return {
				ok: false,
				statusCode: HttpStatus.BAD_REQUEST,
				message: '해당하는 유저를 찾을 수 없습니다.'
			};
		}
		const responseCreatedUser =  await this.userRepository.createUser(foundUser);
		return {
			ok:true,
			statusCode : HttpStatus.CREATED,
			message:'SUCCESS',
			data:responseCreatedUser,
		};
	}

	async findAuthId(authId:string , type){
		const responseAuthId = await this.userRepository.findAuthId(authId,type);
		if(!test){
			return {
				ok:false,
				statusCdoe:HttpStatus.NOT_FOUND,
				message:'NOT_FOUND',
				data:[],
			};
		}
		return {
			ok : true,
			statusCode : HttpStatus.OK,
			message: 'SUCCESS',
			data:responseAuthId,
		};
	}

	async findAuthLoginId(id:number){
		const foundUserAuthId = await this.userRepository.findAuthLoginId(id);
		if(isNil(foundUserAuthId)){
			return {
				ok : false,
				statusCode : HttpStatus.NOT_FOUND,
				message: 'NOT_FOUND_USER',
			};
		}

		return {
			ok : true,
			statusCode : HttpStatus.OK,
			message: 'SUCCESS',
			data:foundUserAuthId,
		};
	}

	async logIn(logInDto:LoginRequestDto) {
		const {username ,password}= logInDto;
		const foundUser = await this.userRepository.findByUsername({ username: username });
		if (isNil(foundUser)) {
			return {
				ok: false,
				statusCode: HttpStatus.BAD_REQUEST,
				message: '해당하는 유저를 찾을 수 없습니다.'
			};
		}
		const result = await bcrypt.compare(password, foundUser.password);
		const payload = {username: foundUser.username};
		const jwt = await Jwt.sign(payload, process.env.JWT, {expiresIn: '30d'});

		if (result) {
			delete foundUser.password;
			return {
				ok:true,
				statusCode:HttpStatus.OK,
				message:'SUCCESS',
				data:{
					user : foundUser,
					jwt : jwt
				}
			};
		}
		return {
			ok:false,
			statusCode:HttpStatus.BAD_REQUEST,
			message:'username 과 password 를 확인하세요'
		};
	}

	async kakaoCallback(){

	}

		// async kakaoSignUp(signUpDto :SignUpRequestDto){
		// 	const createUser = await this.usersRepository.save(signUpDto);
		// 	delete createUser.password;
		// 	return createUser;
		// }
}
