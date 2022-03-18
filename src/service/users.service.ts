import { HttpStatus, Injectable } from '@nestjs/common';
// Entity
import { SignUpRequestDto } from '../controller/users/users.controller.dto/signUpDto/signUp.request.dto';
import { UserRepository } from '../database/repository/user.repository';
import { CoreResponse } from '../shared/CoreResponse';
import { LoginRequestDto } from '../controller/users/users.controller.dto/logInDto/logIn.request.dto';
import bcrypt from 'bcrypt';
import * as Jwt from 'jsonwebtoken';
import { isNil } from 'lodash';

@Injectable()
export class UsersService {
	constructor(
		private readonly userRepository: UserRepository,
	) {}

	async findByUsername(username: string): Promise<CoreResponse> {
		const foundUser = await this.userRepository.findByUsername(username).getOne();
		const {password , ...userData} = foundUser;
		return {
			ok: !isNil(foundUser),
			statusCode: !isNil(foundUser) ? HttpStatus.OK : HttpStatus.BAD_REQUEST,
			message: !isNil(foundUser) ? 'SUCCESS' : 'BAD_REQUEST',
			data: !isNil(foundUser) ? userData : null,
		};
	}

	async findMyBoards(email:string){
		const foundMyBoards = await this.userRepository.findMyBoard(email).getMany();
		return {
			ok: !isNil(foundMyBoards),
			statusCode: !isNil(foundMyBoards) ? HttpStatus.OK : HttpStatus.NOT_FOUND,
			message: !isNil(foundMyBoards) ? 'SUCCESS' : 'NOT_FOUND',
			data: !isNil(foundMyBoards) ? foundMyBoards : [],
		};

	}

	async signUp(signUpDto: SignUpRequestDto): Promise<CoreResponse> {
		const { password, username, email, phone } = signUpDto;
		const foundUser = await this.userRepository.findByUsername(email).getOne();
		if (foundUser) {
			return {
				ok: false,
				statusCode: HttpStatus.BAD_REQUEST,
				message: 'exist user',
				data:[],
			};
		}
		const responseCreatedUser = await this.userRepository.createUser(signUpDto);
		return {
			ok: true,
			statusCode: HttpStatus.CREATED,
			message: 'SUCCESS',
			data: responseCreatedUser,
		};
	}

	async findAuthId(authId:string , type) {
		const foundUserByAuthId = await this.userRepository.findAuthId(authId,type);
		return {
			ok: !isNil(foundUserByAuthId),
			statusCode: !isNil(foundUserByAuthId) ? HttpStatus.OK : HttpStatus.NOT_FOUND,
			message: !isNil(foundUserByAuthId) ? 'SUCCESS' : 'NOT_FOUND',
			data: !isNil(foundUserByAuthId) ? foundUserByAuthId : null,
		};
	}

	async findAuthLoginId(id:number) {
		const foundUserAuthId = await this.userRepository.findAuthLoginId(id).getMany();
		return {
			ok: !isNil(foundUserAuthId),
			statusCode: !isNil(foundUserAuthId) ? HttpStatus.OK : HttpStatus.BAD_REQUEST,
			message: !isNil(foundUserAuthId) ? 'SUCCESS' : 'BAD_REQUEST',
			data: !isNil(foundUserAuthId) ? foundUserAuthId : null,
		};
	}

	async logIn(logInDto:LoginRequestDto) {
		const {email ,password}= logInDto;
		const foundUser = await this.userRepository.findByUsername(email).getOne();
		if (isNil(foundUser)) {
			return {
				ok: false,
				statusCode: HttpStatus.NOT_FOUND,
				message: 'does not found user'
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

	// async kakaoCallback(){
	//
	// }

		// async kakaoSignUp(signUpDto :SignUpRequestDto){
		// 	const createUser = await this.usersRepository.save(signUpDto);
		// 	delete createUser.password;
		// 	return createUser;
		// }
}
