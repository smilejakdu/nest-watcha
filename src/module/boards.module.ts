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


@Module({
	imports: [
		ElasticsearchModule.register({
			node: 'http://localhost:9200',
			// 기타 Elasticsearch 클라이언트 옵션 (예: API 버전, 인증 등) 설정
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
