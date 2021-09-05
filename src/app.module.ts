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
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule implements NestModule {
	/*
		https://jakekwak.gitbook.io/nestjs/overview/untitled-2
		@Module() 데코레이터에는 미들웨어를 위한 공간이 존재하지않는다.
		대신 모듈 클래스의 configure() 메소드를 사용하여 설정하게 된다.
		apply 메소드는 단일 미들웨어 또는 여러 인수를 사용하여 다중 미들웨어를 지정할수있다.
		forRoutes({ path: 'ab*cd', method: RequestMethod.ALL });
		키값은 생략이 가능하다.
	*/
	configure(consumer: MiddlewareConsumer): any {
		consumer.apply(LoggerMiddleware).forRoutes('*');
	}
}
