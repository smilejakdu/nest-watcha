import { Module } from '@nestjs/common';
import { BoardsService } from '../service/boards.service';
import { BoardsController } from '../controller/board/boards.controller';
import { BoardsRepository } from '../database/repository/BoardRepository/boards.repository';
import { BoardImageService } from "../service/boardImage.service";
import { HashtagService } from "../service/hashtag.service";
import { BoardImageRepository } from "../database/repository/BoardRepository/boardImage.repository";
import { HashtagRepository } from "../database/repository/hashtag.repository";
import { TypeOrmExModule } from "../shared/typeorm/typeorm-ex.module";

@Module({
	imports: [
		TypeOrmExModule.forCustomRepository([
			BoardsRepository,
			BoardImageRepository,
			HashtagRepository,
		]),
	],
	providers: [BoardsService, BoardImageService, HashtagService],
	controllers: [BoardsController],
	exports: [BoardsService],
})
export class BoardsModule {}
