import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtPayload } from '../interface/payload.interface';
import 'dotenv/config';
import { UsersService } from '../../../database/service/users.service';
import { AuthService } from '../../../database/service/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 요청 헤더에서 bearer token으로 jwt를 가져옴
      ignoreExpiration: false,
      secretOrKey: process.env.SECRETKEY, // jwt 복호화해서 유효한지 확인할 때 사용
      // JwtModule에 넘긴 값과 같은 값 사용할것
    });
  }

  // jwt strategy는 토큰 추출해서 유효한지 확인함
  // 토큰이 유효하지 않으면 401 응답
  // 유효하면 validate 함수 실행
  async validate(payload: JwtPayload): Promise<any> {
    const user = await this.authService.validateUser(payload); // payload nickname 사용
    if (!user) {
      throw new HttpException('invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  // async validate(payload: { id: string }) {
  //   return this.usersService.getById(payload.id);
  // }
}
