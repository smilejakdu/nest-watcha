import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
// Entity
import { SignUpRequestDto } from '../controller/users/users.controller.dto/signUpDto/signUp.request.dto';
import { UserRepository } from '../database/repository/user.repository';
import { BadRequest, CoreResponse, CreateSuccessFulResponse, SuccessResponse } from '../shared/CoreResponse';
import { LoginRequestDto } from '../controller/users/users.controller.dto/logInDto/logIn.request.dto';
import bcrypt from 'bcryptjs';
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
		return SuccessResponse(userData);
	}

	async findById(id:number) {
		const foundUser = await this.userRepository.findUserById(id).getOne();
		const {password , ...userData} =foundUser;
		if (!foundUser) {
			throw new NotFoundException(`does not found user :${id}`);
		}
		return SuccessResponse(userData);
	}

	async findMyBoards(email:string) {
		const foundMyBoards = await this.userRepository.findMyBoard(email).getMany();
		if(!isNil(foundMyBoards)){
			throw new NotFoundException(`does not found user :${email}`);
		}
		return SuccessResponse(foundMyBoards);
	}

	async signUp(signUpDto: SignUpRequestDto): Promise<CoreResponse> {
		const { password, username, email, phone } = signUpDto;
		const foundUser = await this.userRepository.findByEmail(email).getOne();
		if (foundUser) {
			throw new BadRequestException('exsit user');
		}
		const responseCreatedUser = await this.userRepository.createUser(signUpDto);
		return CreateSuccessFulResponse(responseCreatedUser);
	}

	async socialSignUp(data:any , loginType : LoginType) {
		const responseCreateUser = await this.userRepository.createKakaoUser(data);
		return CreateSuccessFulResponse(responseCreateUser.raw.insertId);
	}

	async findAuthId(authId:string , type) {
		const foundUserByAuthId = await this.userRepository.findAuthId(authId,type);
		return SuccessResponse(foundUserByAuthId);
	}

	async findAuthLoginId(id:number) {
		const foundUserAuthId = await this.userRepository.findAuthLoginId(id).getMany();
		return SuccessResponse(foundUserAuthId);
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
			throw new NotFoundException(`does not found user ${email}`);
		}

		const result = await bcrypt.compare(password, foundUser.password);
		const payload = {email: foundUser.email};
		const jwt = await Jwt.sign(payload, process.env.JWT, {expiresIn: '30d'});

		if (!result) {
			return BadRequest();
		}
		delete foundUser.password;
		return SuccessResponse({
			user : foundUser,
			access_token : jwt
		});
	}

	async createToken(user: any) {
		const token = await this.userRepository.getToken({email:user.email});
		user.accessToken = token;
		return user;
	}
}
