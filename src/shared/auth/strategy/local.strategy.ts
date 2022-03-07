import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../../database/service/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private authService: AuthService) {
		super({ usernameField: 'username', passwordField: 'password' });
	}

	async validate(username: string, password: string, done: CallableFunction) {
		const user = await this.authService.validateUser({username, password});
		if (!user) {
			throw new UnauthorizedException();
		}
		return done(null, user);
		// done(null, user); 부분에서
		// local-auth.guard.ts 부분에 있는 await super.logIn(request)
		// super.logIn(request) 가 되고나면 local.serializer.ts 에있는 serializeUser 로 간다 생각하면 된다.
	}
}
