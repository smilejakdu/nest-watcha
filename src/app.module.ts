import {CacheModule, MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
import {BoardHashTagEntity} from "./database/entities/Board/BoardHashTag.entity";
import {BoardImageEntity} from "./database/entities/Board/BoardImage.entity";
import {BoardsEntity} from "./database/entities/Board/Boards.entity";
import {GenreEntity} from "./database/entities/MovieAndGenre/genre.entity";
import {GenreMovieEntity} from "./database/entities/MovieAndGenre/genreMovie.entity";
import {MovieEntity} from "./database/entities/MovieAndGenre/movie.entity";
import {MovieOptionEntity} from "./database/entities/MovieAndGenre/movieOption.entity";
import {subMovieImageEntity} from "./database/entities/MovieAndGenre/subMovieImage.entity";
import {OrderEntity} from "./database/entities/Order/order.entity";
import {OrderClaimEntity} from "./database/entities/Order/orderClaim.entity";
import {OrderLogEntity} from "./database/entities/Order/orderLog.entity";
import {PurchaseEntity} from "./database/entities/Purchase/purchase.entity";
import {PurchaseVbankEntity} from "./database/entities/Purchase/purchase_vbank.entity";
import {PermissionEntity} from "./database/entities/User/Permission.entity";
import {UsersEntity} from "./database/entities/User/Users.entity";
import {CoreEntity} from "./database/entities/core.entity";
import {CommentsEntity} from "./database/entities/comments.entity";
import {HashTagEntity} from "./database/entities/hashTag.entity";
import {SchedulesEntity} from "./database/entities/schedules.entity";
import { HealthModule } from './module/health.module';
import * as redisStore from 'cache-manager-redis-store';

@Module({
	imports: [
		CacheModule.register({
			isGlobal: true,
			host: 'localhost',
			port: 6679,
			password: process.env.REDIS_PASSWORD,
		}),
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
			}),
		}),
		TypeOrmModule.forRoot({
			type: 'mysql',
			host: process.env.MYSQL_HOST,
			port: Number(process.env.MYSQL_PORT),
			username: process.env.MYSQL_USER,
			password: process.env.MYSQL_PASSWORD,
			database: process.env.MYSQL_DATABASE,
			entities: [
				BoardHashTagEntity,
				BoardImageEntity,
				BoardsEntity,
				GenreEntity,
				GenreMovieEntity,
				MovieEntity,
				MovieOptionEntity,
				subMovieImageEntity,
				OrderEntity,
				OrderClaimEntity,
				OrderLogEntity,
				PurchaseEntity,
				PurchaseVbankEntity,
				PermissionEntity,
				UsersEntity,
				CoreEntity,
				CommentsEntity,
				HashTagEntity,
				SchedulesEntity,
			],
			autoLoadEntities: true,
			charset: "utf8mb4",
			synchronize: true,
			logging: process.env.NODE_ENV === 'local' ? true : false,
		}),
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
