import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import express from 'express';
import passport from 'passport';
import { join } from 'path'
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';
import {SwaggerSetting} from "./shared/swaggerConfig";

declare const module: any;

async function bootstrap() {
	const app: NestExpressApplication = await NestFactory.create<NestExpressApplication>(AppModule);
	app.setGlobalPrefix('api');
	const port = process.env.HOST || 13014;

	app.useGlobalPipes(new ValidationPipe());
	app.useGlobalFilters(new HttpExceptionFilter());

	SwaggerSetting(app);

	app.use(cookieParser());
	app.enableCors({
		origin: true,
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
		credentials: true,
	});
	app.use('/public', express.static(join(__dirname, '../public')));

	app.use(passport.initialize());
	await app.listen(port);

	if (module.hot) {
		module.hot.accept();
		module.hot.dispose(() => app.close());
	}
}
bootstrap();
