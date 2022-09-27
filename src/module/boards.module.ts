import { Module } from '@nestjs/common';
import { BoardsService } from '../service/boards.service';
import { BoardsController } from '../controller/board/boards.controller';
import { BoardsRepository } from '../database/repository/BoardRepository/boards.repository';
import { TypeOrmExModule } from 'src/shared/typeorm-ex.module';

@Module({
	imports: [
		TypeOrmExModule.forCustomRepository([
			BoardsRepository,
		]),
	],
	providers: [BoardsService],
	controllers: [BoardsController],
	exports: [BoardsService],
})
export class BoardsModule {}
