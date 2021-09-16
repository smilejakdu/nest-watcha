import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './middlewares/logger.middlewares';
import { UsersModule } from './users/users.module';
import { BoardsModule } from './boards/boards.module';
import * as ormconfig from '../ormconfig';
import { CommentsModule } from './comments/comments.module';
import { SchedulesModule } from './schedules/schedules.module';
import { UsersService } from './users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { HashtagController } from './hashtag/hashtag.controller';
import { HashtagService } from './hashtag/hashtag.service';
import { HashtagModule } from './hashtag/hashtag.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		TypeOrmModule.forRoot(ormconfig),
		AuthModule,
		UsersModule,
		BoardsModule,
		CommentsModule,
		SchedulesModule,
		HashtagModule,
	],
	controllers: [AppController, HashtagController],
	providers: [AppService, HashtagService],
})

export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer): any {
		consumer.apply(LoggerMiddleware).forRoutes('*');
	}
}

// export class AppModule {}
