import { Module } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { UsersController } from '../controller/users/users.controller';
import { UserRepository } from '../database/repository/user.repository';
import { TypeOrmExModule } from 'src/shared/typeorm-ex.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {PermissionEntity} from "../database/entities/User/Permission.entity";
import {GoogleStrategy} from "../strategies/google.strategy";

@Module({
	imports: [
		TypeOrmExModule.forCustomRepository([
			UserRepository,
		]),
		TypeOrmModule.forFeature([PermissionEntity]),
	],
	providers: [UsersService, GoogleStrategy],
	controllers: [UsersController],
	exports: [UsersService],
})
export class UsersModule {}
