import { BadRequestException, HttpStatus, Injectable, NotFoundException, Res } from "@nestjs/common";
// Entity
import { SignUpRequestDto } from "../controller/users/users.controller.dto/signUpDto/signUp.request.dto";
import { UserRepository } from "../database/repository/user.repository";
import { CoreResponseDto, SuccessFulResponse } from "../shared/CoreResponse";
import { LoginRequestDto } from "../controller/users/users.controller.dto/logInDto/logIn.request.dto";
import bcrypt from "bcryptjs";
import * as Jwt from "jsonwebtoken";
import * as crypto from "crypto";
import { LoginType, UsersEntity } from "../database/entities/User/Users.entity";
import { DataSource, QueryRunner } from "typeorm";
import { Response } from "express";
import { transactionRunner } from "src/shared/common/transaction/transaction";
import { UserFindResponseDto } from "../controller/users/users.controller.dto/userFindDto/userFind.response.dto";
import { GoogleUserData, KakaoUserData } from "../types";
import { BoardsRepository } from "../database/repository/BoardRepository/boards.repository";
import { ConfigService } from "@nestjs/config";
import { OneWeeks } from "../shared/dateFormat/dateFormat.service";

@Injectable()
export class UsersService {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly boardRepository: BoardsRepository,
		private readonly dataSource: DataSource,
		private readonly configService: ConfigService,
	) {}

	async findMyBoardsByEmail(userId: number) {
		const [foundUser, foundMyBoards] = await Promise.all([
			await this.userRepository.findOneBy({ id: userId }),
			await this.boardRepository.findMyBoardByUserId(userId),
		]);

		if (!foundUser) {
			throw new NotFoundException('존재하지 않는 유저입니다.');
		}

		return SuccessFulResponse({
			user: foundUser,
			myBoards: foundMyBoards,
		});
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

	async signUp(signUpDto: SignUpRequestDto): Promise<CoreResponseDto> {
		const { password, email } = signUpDto;
		const foundUser = await this.userRepository.findOneBy({ email });

		if (foundUser) {
			throw new BadRequestException('이미 존재하는 이메일 입니다.');
		}

		const regExp = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/;
		if (!regExp.test(password)) {
			throw new BadRequestException('비밀번호는 숫자와 영문자를 포함하여 8자 이상이어야 합니다.');
		}

		const responseSignUpUser = await transactionRunner(async (queryRunner) => {
			signUpDto.password = await bcrypt.hash(password, 12);
			return await queryRunner.manager.save(UsersEntity, signUpDto);
		},this.dataSource);

		delete responseSignUpUser.password;
		return SuccessFulResponse(responseSignUpUser, HttpStatus.CREATED);
	}

	async findAuthId(authId:string , type) {
		const foundUserByAuthId = await this.userRepository.findAuthId(authId,type);
		return SuccessFulResponse(foundUserByAuthId);
	}

	async findUserByEmail(email: string): Promise<UserFindResponseDto> {
		const foundUser= await this.userRepository.findOne({
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
		const { id, email , username } = userData;
		const foundUser = await this.userRepository.findOneBy({ email });
		if (!foundUser) {
			const newUser = new UsersEntity();
			newUser.username = username;
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
		const { id, email, username }	= naverUserData;
		const foundUser = await this.userRepository.findOneBy({ email });
		if (!foundUser) {
			const newUser = new UsersEntity();
			newUser.username = username;
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
		const options: Jwt.SignOptions = {expiresIn: '1d', issuer: 'robert', algorithm: 'HS256'};
		const accessToken = Jwt.sign(payload, process.env.JWT_SECRET, options);
		delete foundUser.password;

		const domain = process.env.NODE_ENV === 'production' ? 'grow_up.im' : 'localhost';

		res.cookie('access-token', accessToken, {
			domain: domain,
			sameSite: this.configService.get('STAGE') !== 'local' ? 'none' : 'lax',
			httpOnly: this.configService.get('STAGE') !== 'local',
			secure: this.configService.get('STAGE') !== 'local',
			maxAge: OneWeeks,
		});

		return SuccessFulResponse({ user: foundUser });
	}

	async updateUser(userData: UsersEntity) {
		const updatedUser = await transactionRunner(async (queryRunner:QueryRunner)=>{
			return await queryRunner.manager.save(UsersEntity, userData);
		},this.dataSource);
		return SuccessFulResponse(updatedUser);
	}

	async makeAccessToken(user: UsersEntity) {
		const payload = {email: user.email};
		const options: Jwt.SignOptions = {
			expiresIn: OneWeeks,
			issuer: 'robert',
			algorithm: 'HS256',
		};
		return Jwt.sign(payload, this.configService.get('JWT_SECRET'), options);
	}
}
