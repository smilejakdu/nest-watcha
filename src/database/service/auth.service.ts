import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from '../entities/UsersEntity';
import { KakaoLoginDto } from '../../controller/auth/auth.controller.dto/kakao-login.dto';
import { JwtPayload } from '../../shared/auth/interface/payload.interface';
import { CoreResponse } from '../../shared/CoreResponse';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(UsersEntity) private usersRepository: Repository<UsersEntity>,
		private readonly usersService : UsersService,
	) {}

	// jwt strategy에서 유저 유효한지 확인할 때 사용
	async validateUser(payload: JwtPayload): Promise<CoreResponse> {
		const foundUser = await UsersEntity.findByUsername(payload.username).getOne();
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

	async kakaoLogin(kakaoLoginDto: KakaoLoginDto) {
		const { kakaoId, username, email,phone } = kakaoLoginDto;
		// let user = await this.usersService.findByKakaoId(kakaoId);
		// let user = await UserAuthEntity.findLoginId(kakaoId);
		let result;
		const user = await UsersEntity.findAuthLoginId(kakaoId);
		if (!user) {
			 result = await this.usersService.kakaoSignUp({
				username,
				password: email,
				phone,
				email,
				kakao_auth_id:kakaoId,
			});
		}
		// const accessToken = this._createToken(user);
		// const refreshToken = this._createRefreshToken(user);
		// await this.saveRefreshToken(user.username, refreshToken);
		// return { username: result.username, ...refreshToken, ...accessToken };
		return { username: result.username};
	}
}
