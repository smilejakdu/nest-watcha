import { Module } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { UsersController } from '../controller/users/users.controller';
import { UserRepository } from '../database/repository/user.repository';
import { TypeOrmModule } from "@nestjs/typeorm";
import { PermissionEntity } from "../database/entities/User/Permission.entity";
import { GoogleStrategy } from "../strategies/google.strategy";
import { KakaoStrategy } from "../strategies/kakao.strategy";
import {NaverStrategy} from "../strategies/naver.strategy";
import {BoardsRepository} from "../database/repository/BoardRepository/boards.repository";
import {TypeOrmExModule} from "../shared/typeorm/typeorm-ex.module";

@Module({
	imports: [
		TypeOrmExModule.forCustomRepository([
			UserRepository,
			BoardsRepository,
		]),
		TypeOrmModule.forFeature([PermissionEntity]),
	],
	providers: [UsersService],
	controllers: [UsersController],
	exports: [UsersService],
})
export class UsersModule {}
