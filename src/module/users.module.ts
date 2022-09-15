import { Module } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { UsersController } from '../controller/users/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../database/repository/user.repository';
import { BoardsService } from '../service/boards.service';
import { BoardsRepository } from '../database/repository/BoardRepository/boards.repository';

@Module({
	imports: [TypeOrmModule.forFeature([UserRepository,BoardsRepository])],
	providers: [UsersService,BoardsService],
	exports: [UsersService],
	controllers: [UsersController],
})
export class UsersModule {}
