import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const Token = createParamDecorator(
	(data: unknown, ctx: ExecutionContext) => {
		const response = ctx.switchToHttp().getResponse();
		return response.locals.jwt;
	},
);

// @Token() token
// 이런식으로 사용할 수가 있다.