import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { join } from 'path';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';

declare const module: any;

async function bootstrap() {
	const app: NestExpressApplication = await NestFactory.create<NestExpressApplication>(AppModule);
	const port = process.env.HOST || 4000;

	app.useGlobalPipes(new ValidationPipe());
	app.useGlobalFilters(new HttpExceptionFilter());

	const config = new DocumentBuilder().setTitle('nestWatcha API').setDescription('nestWatcha Swagger').setVersion('1.0').addCookieAuth('connect.sid').build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	app.use(cookieParser());
	app.use(
		session({
			resave: false,
			saveUninitialized: false,
			secret: process.env.COOKIE_SECRET,
			cookie: {
				httpOnly: true,
			},
		}),
	);
	app.enableCors({
		origin: true,
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
		credentials: true,
	});
	app.use('/public', express.static(join(__dirname, '../public')));

	app.use(passport.initialize());
	app.use(passport.session());
	await app.listen(port);

	if (module.hot) {
		module.hot.accept();
		module.hot.dispose(() => app.close());
	}
}
bootstrap();
