import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from '../entities/UsersEntity';
import { KakaoLoginDto } from '../../controller/auth/auth.controller.dto/kakao-login.dto';
import { JwtPayload } from '../../shared/auth/interface/payload.interface';
import { CoreResponse } from '../../shared/CoreResponse';

@Injectable()
export class AuthService {
	constructor(@InjectRepository(UsersEntity) private usersRepository: Repository<UsersEntity>) {}

	// jwt strategy에서 유저 유효한지 확인할 때 사용
	async validateUser(payload: JwtPayload): Promise<CoreResponse> {
		const foundUser = await UsersEntity.findByNickname(payload.nickname).getOne();
		// passport 미들웨어 실행 후 토큰이 유효한 경우에 한해 JwtStrategy.validate()함수에서 호출된다
		if (!foundUser) {
			throw new HttpException('invalid token', HttpStatus.UNAUTHORIZED);
		}
		return {
			statusCode: HttpStatus.OK,
			message: 'SUCCESS',
			data: foundUser,
		};
	}

	async register(userDto: CreateUserDto): Promise<RegistrationStatus> {
		let status = {
			success: true,
			message: 'user registered',
			user: null,
		};

		try {
			status.user = await this.usersService.create(userDto);
		} catch (error) {
			status = {
				...status,
				success: false,
				message: error.message,
			};
		}
		return status;
	}

	async kakaoLogin(kakaoLoginDto: KakaoLoginDto) {
		const { kakaoId, username, email } = kakaoLoginDto;
		// let user = await this.usersService.findByKakaoId(kakaoId);
		let user = await UserAuthEntity.findLoginId(kakaoId);
		if (!user) {
			await this.register({
				username,
				password: username,
				email,
				kakaoId,
			});
			user = await this.usersService.findByKakaoId(kakaoId);
		}
		const accessToken = this._createToken(user);
		const refreshToken = this._createRefreshToken(user);
		await this.saveRefreshToken(user.username, refreshToken);
		return { username: user.username, ...refreshToken, ...accessToken };
	}
}
