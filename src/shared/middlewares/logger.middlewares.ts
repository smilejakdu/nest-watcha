import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import * as Jwt from "jsonwebtoken";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
	// https://docs.nestjs.com/middleware#functional-middleware
	private logger = new Logger('HTTP');

	use(request: Request, response: Response, next: NextFunction): void {
		const { ip, method, originalUrl } = request;
		const userAgent = request.get('user-agent') || '';
		const accessToken = request.headers['access-token'] as string;
		if (!accessToken) {
			response.on('finish', () => {
				const { statusCode } = response;
				const contentLength = response.get('content-length');

				this.logger.log(`${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`);
			});
			next();
		} else {
			try {
				const decodedUserJwt: any = Jwt.verify(accessToken, process.env.JWT_SECRET);
				const userEmail = decodedUserJwt?.email;

				response.on('finish', () => {
					const { statusCode } = response;
					const contentLength = response.get('content-length');
					this.logger.log(`${userEmail} ${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`);
				});
				next();
			} catch (jwtErr) {
				this.logger.log('end point log', jwtErr);
				next();
			}
		}
	}
}
