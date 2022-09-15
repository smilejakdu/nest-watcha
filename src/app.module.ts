import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './shared/middlewares/logger.middlewares';
import { UsersModule } from './module/users.module';
import { BoardsModule } from './module/boards.module';
import ormconfig from '../ormconfig';
import { CommentsModule } from './module/comments.module';
import { SchedulesModule } from './module/schedules.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashtagModule } from './module/hashtag.module';
import { ImageModule } from './module/image.module';
import { GenreModule } from './module/genre.module';
import { MovieModule } from './module/movie.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		TypeOrmModule.forRoot(ormconfig),
		ScheduleModule.forRoot({
			type: "mysql",
			host: process.env.MYSQL_HOST,
			port: Number(process.env.MYSQL_PORT),
			username: process.env.MYSQL_USER,
			password: process.env.MYSQL_PASSWORD,
			database: process.env.MYSQL_DATABASE,
			entities: [
			],
		}),
		UsersModule,
		BoardsModule,
		CommentsModule,
		SchedulesModule,
		HashtagModule,
		ImageModule,
		GenreModule,
		MovieModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer): any {
		consumer.apply(LoggerMiddleware).forRoutes('*');
	}
}
