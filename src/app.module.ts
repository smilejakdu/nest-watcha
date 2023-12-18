import {CacheModule, MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import { LoggerMiddleware } from './shared/middlewares/logger.middlewares';
import { UsersModule } from './module/users.module';
import { BoardsModule } from './module/boards.module';
import { CommentsModule } from './module/comments.module';
import { SchedulesModule } from './module/schedules.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashtagModule } from './module/hashtag.module';
import { ImageModule } from './module/image.module';
import { GenreModule } from './module/genre.module';
import { MovieModule } from './module/movie.module';
import { ScheduleModule } from '@nestjs/schedule';
import Joi from 'joi';
import { HealthModule } from './module/health.module';
import {typeormModule} from "./shared/typeorm/typeorm.module";
import {BullModule} from "@nestjs/bull";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath:
				process.env.NODE_ENV === 'prod' ? '.env.prod'
					: process.env.NODE_ENV === 'dev' ? 'dev.env'
						: 'local.env',
			validationSchema: Joi.object({
				NODE_ENV: Joi.string().valid('local', 'dev', 'prod').required(),
				MYSQL_HOST: Joi.string().required(),
				MYSQL_PORT: Joi.string().required(),
				MYSQL_USER: Joi.string().required(),
				MYSQL_PASSWORD: Joi.string().required(),
				MYSQL_DATABASE: Joi.string().required(),
				REDIS_HOST: Joi.string().required(),
				REDIS_PORT: Joi.string().required(),
				REDIS_PASSWORD: Joi.string().required(),
				REDIS_CACHE_TTL: Joi.string().required(),
				REDIS_CACHE_MAX: Joi.string().required(),
			}),
		}),
		TypeOrmModule.forRootAsync(typeormModule),
		ScheduleModule.forRoot(),
		UsersModule,
		BoardsModule,
		CommentsModule,
		SchedulesModule,
		HashtagModule,
		ImageModule,
		GenreModule,
		MovieModule,
		HealthModule,
	],
	controllers: [],
	providers: [],
})

export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer): any {
		consumer.apply(LoggerMiddleware).forRoutes('*');
	}
}
