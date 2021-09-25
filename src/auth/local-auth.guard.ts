import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
	// AuthGuard 안에 CanActivate 가 들어있다.
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const can = await super.canActivate(context);
		if (can) {
			const request = context.switchToHttp().getRequest();
			await super.logIn(request);
		}

		return true;
	}
}
