import { Module } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { UsersController } from '../controller/users/users.controller';
import { UserRepository } from '../database/repository/user.repository';
import { TypeOrmExModule } from 'src/shared/typeorm-ex.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {PermissionEntity} from "../database/entities/User/Permission.entity";
import {BoardsEntity} from "../database/entities/Board/Boards.entity";
import {OrderEntity} from "../database/entities/Order/order.entity";
import {BoardsRepository} from "../database/repository/BoardRepository/boards.repository";

@Module({
	imports: [
		TypeOrmExModule.forCustomRepository([
			UserRepository,
		]),
		TypeOrmModule.forFeature([PermissionEntity]),
	],
	providers: [UsersService],
	controllers: [UsersController],
	exports: [UsersService],
})
export class UsersModule {}
