import { Module } from '@nestjs/common';
import { HashtagController } from '../controller/hashtag/hashtag.controller';
import { HashtagService } from '../service/hashtag.service';
import { HashtagRepository } from '../database/repository/hashtag.repository';
import { BoardsRepository } from '../database/repository/BoardRepository/boards.repository';
import { TypeOrmExModule } from "../shared/typeorm-ex.module";
import { BoardImageRepository } from "../database/repository/BoardRepository/boardImage.repository";

@Module({
	imports: [
		TypeOrmExModule.forCustomRepository([
			BoardsRepository,
			HashtagRepository,
			BoardImageRepository,
		]),
	],
	providers: [HashtagService],
	controllers: [HashtagController],
	exports: [HashtagService],
})
export class HashtagModule {}
