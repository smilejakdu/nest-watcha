import { BadRequestException, HttpStatus, Injectable, NotFoundException, Res } from '@nestjs/common';
// Entity
import { SignUpRequestDto } from '../controller/users/users.controller.dto/signUpDto/signUp.request.dto';
import { UserRepository } from '../database/repository/user.repository';
import { CoreResponse, SuccessFulResponse } from '../shared/CoreResponse';
import { LoginRequestDto } from '../controller/users/users.controller.dto/logInDto/logIn.request.dto';
import bcrypt from 'bcryptjs';
import * as Jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { LoginType, UsersEntity } from '../database/entities/User/Users.entity';
import { DataSource, QueryRunner } from 'typeorm';
import {Response} from "express";
import { transactionRunner } from 'src/shared/common/transaction/transaction';
import {UserFindResponseDto} from "../controller/users/users.controller.dto/userFindDto/userFind.response.dto";
import {FoundUserType, GoogleUserData, KakaoUserData} from "../types";
import {retry} from "rxjs";

@Injectable()
export class UsersService {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly dataSource: DataSource,
	) {}

	async findMyBoardsByEmail(email:string) {
		const foundMyBoards = await this.userRepository.findMyBoardByEmail(email)
		return SuccessFulResponse(foundMyBoards);
	}

	async encryptPhoneNumber(phoneNumber: string) {
		const algorithm = 'aes-256-ctr';
		const password = 'MySuperSecretKey';

		const iv = crypto.randomBytes(16);
		const cipher = crypto.createCipheriv(algorithm, password, iv);
		let encrypted = cipher.update(phoneNumber, 'utf8', 'hex');
		encrypted += cipher.final('hex');
		return iv.toString('hex') + encrypted;
	}

	async decryptPhoneNumber(phoneNumber: string) {
		const algorithm = 'aes-256-ctr';
		const password = 'MySuperSecretKey';

		const iv = Buffer.from(phoneNumber.slice(0, 32), 'hex');
		const encryptedData = phoneNumber.slice(32);
		const decipher = crypto.createDecipheriv(algorithm, password, iv);
		let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
		decrypted += decipher.final('utf8');
		return decrypted;
	}

	async signUp(signUpDto: SignUpRequestDto): Promise<CoreResponse> {
		const { password, email } = signUpDto;
		const foundUser = await this.userRepository.findOneBy({ email });
		if (foundUser) {
			throw new BadRequestException('이미 존재하는 이메일 입니다.');
		}

		const responseSignUpUser = await transactionRunner(async (queryRunner:QueryRunner) => {
			const hashedPassword = await bcrypt.hash(password, 12);
			signUpDto.password = hashedPassword;
			return await queryRunner.manager.save(UsersEntity, signUpDto);
		},this.dataSource);

		delete responseSignUpUser.password;
		return SuccessFulResponse(responseSignUpUser ,HttpStatus.CREATED);
	}

	async socialSignUp(data: any) {
		const newUser = new UsersEntity();
		newUser.username = data.properties.nickname;
		newUser.email = data.kakao_account.email;
		newUser.kakao_auth_id = data.id;

		const responseSignUpUser = await transactionRunner(async (queryRunner:QueryRunner) => {
			return await queryRunner.manager.save(UsersEntity, newUser);
		},this.dataSource);

		return SuccessFulResponse(responseSignUpUser, HttpStatus.CREATED);
	}

	async findAuthId(authId:string , type) {
		const foundUserByAuthId = await this.userRepository.findAuthId(authId,type);
		return SuccessFulResponse(foundUserByAuthId);
	}

	async findAuthLoginId(id:number) {
		const foundUserAuthId = await this.userRepository.findAuthLoginId(id).getMany();
		return SuccessFulResponse(foundUserAuthId);
	}

	async findUserByEmail(email:string): Promise<UserFindResponseDto> {
		const foundUser: FoundUserType = await this.userRepository.findOne({
			select: ['id', 'email', 'username', 'phone'],
			where: { email },
		})
		return SuccessFulResponse(foundUser);
	}

	async checkRegister(loginType: string, tokenString: string) {
		let foundUser;
		let userData;

		if (loginType === LoginType.KAKAO) {
			console.log('kakao login')
			userData = await this.userRepository.kakaoCallback(tokenString);
			foundUser = await this.findAuthId(userData.id, LoginType.KAKAO);
		}

		return {
			foundUser: foundUser.data,
			userData: userData
		};
	}

	async kakaoLogin(userData: KakaoUserData) {
		const { id, email , nickname } = userData;
		const foundUser = await this.userRepository.findOneBy({ email });
		if (!foundUser) {
			const newUser = new UsersEntity();
			newUser.username = nickname;
			newUser.email = email;
			newUser.kakao_auth_id = id;
			const responseSignUpUser = await transactionRunner(async (queryRunner:QueryRunner) => {
				return await queryRunner.manager.save(UsersEntity, newUser);
			},this.dataSource);
			return SuccessFulResponse(responseSignUpUser);
		}
		return SuccessFulResponse(foundUser);
	}

	async googleLogin(googleUserData: GoogleUserData) {
		const { id, email, firstName, lastName } = googleUserData;
		const foundUser = await this.userRepository.findOneBy({ email });
		if (!foundUser) {
			const newUser = new UsersEntity();
			newUser.username = `${firstName} ${lastName}`;
			newUser.email = email;
			newUser.google_auth_id = id;
			const responseSignUpUser = await transactionRunner(async (queryRunner:QueryRunner) => {
				return await queryRunner.manager.save(UsersEntity, newUser);
			},this.dataSource);
			return SuccessFulResponse(responseSignUpUser);
		}
		return SuccessFulResponse(foundUser);
	}

	async naverLogin(naverUserData) {
		const { id, email, name, profile_image }	= naverUserData;
		const foundUser = await this.userRepository.findOneBy({ email });
		if (!foundUser) {
			const newUser = new UsersEntity();
			newUser.username = name;
			newUser.email = email;
			newUser.naver_auth_id = id;
			const responseSignUpUser = await transactionRunner(async (queryRunner:QueryRunner) => {
				return await queryRunner.manager.save(UsersEntity, newUser);
			},this.dataSource);
			return SuccessFulResponse(responseSignUpUser);
		}
		return SuccessFulResponse(foundUser);
	}

	async logIn(logInDto:LoginRequestDto, @Res() res: Response) {
		const { email, password }= logInDto;
		const [foundUser] = await Promise.all([this.userRepository.findOneBy({email})]);
		if (!foundUser) {
			throw new NotFoundException(`does not found user ${email}`);
		}

		if (!await bcrypt.compare(password, foundUser.password)) {
			throw new BadRequestException('password is not correct');
		}

		const payload = {email: foundUser.email};
		const options = {expiresIn: '1d', issuer: 'ash-admin', algorithm: 'HS256'};
		const accessToken = await Jwt.sign(payload, process.env.JWT_SECRET);
		delete foundUser.password;

		res.cookie('access-token', accessToken, {
			domain: 'localhost',
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			maxAge: 14 * 24 * 60 * 60 * 1000,
		});

		return SuccessFulResponse({
			user : foundUser,
			access_token : accessToken,
		});
	}

	async updateUser(userData: UsersEntity) {
		const updatedUser = await transactionRunner(async (queryRunner:QueryRunner)=>{
			return await queryRunner.manager.save(UsersEntity, userData);
		},this.dataSource);
		return SuccessFulResponse(updatedUser);
	}

	async createToken(email: string) {
		return await this.userRepository.getToken(email);
	}
}
