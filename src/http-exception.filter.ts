import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { log } from 'console';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const status = exception.getStatus();
		const err = exception.getResponse() as string | { error: string; statusCode: 400; message: string[] }; // class-validator
		log(status, err);

		// let msg = '';
		if (typeof err !== 'string' && err.error === 'Bad Request') {
			return response.status(status).json({
				ok: false,
				statusCode: status,
				data: err.message,
			});
		}

		response.status(status).json({
			ok: false,
			statusCode: status,
			data: err,
		});
	}
}
