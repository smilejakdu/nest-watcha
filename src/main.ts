import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';

declare const module: any;

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const port = process.env.PORT || 3000;
	app.useGlobalPipes(new ValidationPipe());
	app.useGlobalFilters(new HttpExceptionFilter());

	const config = new DocumentBuilder()
		.setTitle('nestWatcha API')
		.setDescription('nestWatcha Swagger')
		.setVersion('1.0')
		.addCookieAuth('connect.sid')
		.build();
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
	app.use(passport.initialize());
	app.use(passport.session());
	await app.listen(port);
	if (module.hot) {
		module.hot.accept();
		module.hot.dispose(() => app.close());
	}
}
bootstrap();
