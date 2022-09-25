import { Module } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { UsersController } from '../controller/users/users.controller';
import { UserRepository } from '../database/repository/user.repository';
import { BoardsService } from '../service/boards.service';
import { BoardsRepository } from '../database/repository/BoardRepository/boards.repository';
import { TypeOrmExModule } from 'src/shared/typeorm-ex.module';
import { BoardImageRepository } from 'src/database/repository/BoardRepository/boardImage.repository';

@Module({
	imports: [
		TypeOrmExModule.forCustomRepository([
			UserRepository,
			BoardsRepository,
			BoardImageRepository,
		]),
	],
	providers: [UsersService,BoardsService],
	exports: [UsersService],
	controllers: [UsersController],
})
export class UsersModule {}
