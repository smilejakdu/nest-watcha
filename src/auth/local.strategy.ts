import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private authService: AuthService) {
		super({ usernameField: 'nickname', passwordField: 'password' });
	}

	async validate(nickname: string, password: string, done: CallableFunction) {
		const user = await this.authService.validateUser(nickname, password);
		if (!user) {
			throw new UnauthorizedException();
		}
		return done(null, user);
		// done(null, user); 부분에서
		// local-auth.guard.ts 부분에 있는 await super.logIn(request)
		// 가고 그이후 local.serializer.ts 에있는 serializeUser 로 간다 생각하면 된다.
	}
}
