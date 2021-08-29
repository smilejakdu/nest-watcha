import { createParamDecorator, ExecutionContext } from "@nestjs/common";

// User 라틑 데코레이터를 직접 만들어준것임
export const User = createParamDecorator(
	(data: unknown, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest();
		return request.user;
	},
);