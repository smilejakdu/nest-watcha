import { Module } from '@nestjs/common';
import { BoardsService } from '../service/boards.service';
import { BoardsController } from '../controller/board/boards.controller';
import { BoardsRepository } from '../database/repository/BoardRepository/boards.repository';
import { TypeOrmExModule } from 'src/shared/typeorm-ex.module';
import { BoardImageService } from "../service/boardImage.service";
import { HashtagService } from "../service/hashtag.service";
import { BoardImageRepository } from "../database/repository/BoardRepository/boardImage.repository";
import { HashtagRepository } from "../database/repository/hashtag.repository";
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import process from "process";


@Module({
	imports: [
		ElasticsearchModule.registerAsync({
			useFactory: () => ({
				node: process.env.ELASTIC_SEARCH_HOST,
				maxRetries: 5,
				requestTimeout: 60000,
				pingTimeout: 60000,
				sniffOnStart: true,
			}),
		}),
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
