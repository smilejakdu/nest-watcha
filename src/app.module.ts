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
import { GenreMovieEntity } from './database/entities/genreMovie.entity';
import { MovieModule } from './module/movie.module';
import { MovieOptionEntity } from './database/entities/movieOption.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		TypeOrmModule.forRoot(ormconfig),
		ScheduleModule.forRoot(),
		UsersModule,
		BoardsModule,
		CommentsModule,
		SchedulesModule,
		HashtagModule,
		ImageModule,
		GenreModule,
		MovieModule,
		MovieOptionEntity,
		GenreMovieEntity,
	],
	controllers: [],
	providers: [],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer): any {
		consumer.apply(LoggerMiddleware).forRoutes('*');
	}
}
