import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
// Entity
import { SignUpRequestDto } from '../controller/users/users.controller.dto/signUpDto/signUp.request.dto';
import { UserRepository } from '../database/repository/user.repository';
import { CoreResponse } from '../shared/CoreResponse';
import { LoginRequestDto } from '../controller/users/users.controller.dto/logInDto/logIn.request.dto';
import bcrypt from 'bcrypt';
import * as Jwt from 'jsonwebtoken';
import { isNil } from 'lodash';
import { LoginType } from '../database/entities/users.entity';

@Injectable()
export class UsersService {
	constructor(
		private readonly userRepository: UserRepository,
	) {}

	async findByEmail(email: string): Promise<CoreResponse> {
		const foundUser = await this.userRepository.findByEmail(email).getOne();
		if(!foundUser){
			throw new NotFoundException(`해당하는 유저를 찾을 수 없습니다 ${email}`);
		}
		const {password , ...userData} = foundUser;
		return {
			ok: true,
			statusCode: HttpStatus.OK,
			message: 'SUCCESS',
			data: userData,
		};
	}

	async findById(id:number) {
		const foundUser = await this.userRepository.findUserById(id).getOne();
		const {password , ...userData} =foundUser;
		if (!foundUser) {
			throw new NotFoundException(`does not found user :${id}`);
		}
		return {
			ok: true,
			statusCode: HttpStatus.OK,
			message: 'SUCCESS',
			data: userData,
		};
	}

	async findMyBoards(email:string) {
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
		const foundUser = await this.userRepository.findByEmail(email).getOne();
		if (foundUser) {
			throw new BadRequestException('exsit user');
		}
		const responseCreatedUser = await this.userRepository.createUser(signUpDto);
		return {
			ok: true,
			statusCode: HttpStatus.CREATED,
			message: 'SUCCESS',
			data: responseCreatedUser,
		};
	}

	async socialSignUp(data:any , loginType : LoginType) {
		const responseCreateUser = await this.userRepository.createKakaoUser(data);
		return {
			ok: true,
			statusCode: HttpStatus.CREATED,
			message: 'SUCCESS',
			data: responseCreateUser.raw.insertId,
		};
	}

	async findAuthId(authId:string , type) {
		const foundUserByAuthId = await this.userRepository.findAuthId(authId,type);
		return {
			ok: true,
			statusCode: HttpStatus.OK,
			message: 'SUCCESS',
			data: foundUserByAuthId,
		};
	}

	async findAuthLoginId(id:number) {
		const foundUserAuthId = await this.userRepository.findAuthLoginId(id).getMany();
		return {
			ok: true,
			statusCode: HttpStatus.OK,
			message: 'SUCCESS',
			data: foundUserAuthId,
		};
	}

	async checkRegister(loginType:string, tokenString:string) {
		let foundUser;
		let kakaoUserData;

		if (loginType === LoginType.KAKAO) {
			kakaoUserData = await this.userRepository.kakaoCallback(tokenString);
			foundUser = await this.findAuthId(kakaoUserData.id,LoginType.KAKAO);
		}

		return {
			foundUser: foundUser.data,
			kakaoUserData: kakaoUserData
		};
	}

	async logIn(logInDto:LoginRequestDto) {
		const {email ,password}= logInDto;
		const foundUser = await this.userRepository.findByEmail(email).getOne();
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

	async createToken(user: any, res: any) {
		const token = await this.userRepository.getToken({id:user.id});
		user.accessToken = token;

		res.cookie('accessToken', token, {
			domain: 'localhost',
			expires: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
			httpOnly: true,
			secure: true,
		});

		return res.json(user);
	}
}
