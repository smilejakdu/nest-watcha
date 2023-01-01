import { BadRequestException, HttpStatus, Injectable, NotFoundException, Res } from '@nestjs/common';
// Entity
import { SignUpRequestDto } from '../controller/users/users.controller.dto/signUpDto/signUp.request.dto';
import { UserRepository } from '../database/repository/user.repository';
import { CoreResponse, SuccessFulResponse } from '../shared/CoreResponse';
import { LoginRequestDto } from '../controller/users/users.controller.dto/logInDto/logIn.request.dto';
import bcrypt from 'bcryptjs';
import * as Jwt from 'jsonwebtoken';
import { isNil } from 'lodash';
import { LoginType, UsersEntity } from '../database/entities/User/Users.entity';
import { DataSource, QueryRunner } from 'typeorm';
import { transactionRunner } from "../shared/common/transaction/transaction";
import { Response } from "express";

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

	async signUp(signUpDto: SignUpRequestDto): Promise<CoreResponse> {
		const { password, username, email, phone } = signUpDto;
		const foundUser = await this.userRepository.findOneBy({ email });
		if (foundUser) {
			throw new BadRequestException('exsit user');
		}

		const hashedPassword = await bcrypt.hash(signUpDto.password, 12);
		signUpDto.password = hashedPassword;
		const queryRunner = this.dataSource.createQueryRunner()
		await queryRunner.connect()
		await queryRunner.startTransaction()
		try {
			const responseCreateUser = await queryRunner.manager.save(UsersEntity, signUpDto);
			delete responseCreateUser.password;
			console.log(responseCreateUser)
			await queryRunner.commitTransaction()
			return SuccessFulResponse(responseCreateUser ,HttpStatus.CREATED);
		} catch (e) {
			console.log(e);
			await queryRunner.rollbackTransaction()
		} finally {
			await queryRunner.release();
		}
	}

	async socialSignUp(data:any, loginType : LoginType) {
		const responseCreateUser = await this.userRepository.createKakaoUser(data);
		return SuccessFulResponse(responseCreateUser.raw.insertId,HttpStatus.CREATED);
	}

	async findAuthId(authId:string , type) {
		const foundUserByAuthId = await this.userRepository.findAuthId(authId,type);
		return SuccessFulResponse(foundUserByAuthId);
	}

	async findAuthLoginId(id:number) {
		const foundUserAuthId = await this.userRepository.findAuthLoginId(id).getMany();
		return SuccessFulResponse(foundUserAuthId);
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

	async logIn(logInDto:LoginRequestDto, @Res() res: Response) {
		const { email, password }= logInDto;
		const foundUser = await this.userRepository.findOneBy({ email });
		if (!foundUser) {
			throw new NotFoundException(`does not found user ${email}`);
		}

		if (!await bcrypt.compare(password, foundUser.password)) {
			throw new BadRequestException('password is not correct');
		}

		const payload = {email: foundUser.email};
		const options = {expiresIn: '1d', issuer: 'ash-admin', algorithm: 'HS256'};
		const accessToken = await Jwt.sign(payload, process.env.JWT_SECRET, options);
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
		});
		console.log(updatedUser);
		return SuccessFulResponse(updatedUser);
	}

	async createToken(email: string) {
		return await this.userRepository.getToken({ email });
	}
}
