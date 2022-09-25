import { Module } from '@nestjs/common';
import { BoardsService } from '../service/boards.service';
import { BoardsController } from '../controller/board/boards.controller';
import { BoardsRepository } from '../database/repository/BoardRepository/boards.repository';
import { BoardImageService } from '../service/boardImage.service';
import { BoardImageRepository } from '../database/repository/BoardRepository/boardImage.repository';
import { HashtagService } from '../service/hashtag.service';
import { BoardHashTagEntity } from '../database/entities/Board/BoardHashTag.entity';
import { HashtagRepository } from '../database/repository/hashtag.repository';
import { TypeOrmExModule } from 'src/shared/typeorm-ex.module';

@Module({
	imports: [
		TypeOrmExModule.forCustomRepository([
			BoardHashTagEntity,
			BoardsRepository,
			HashtagRepository,
			BoardImageRepository,
		]),
	],
	providers: [BoardsService,BoardImageService,HashtagService],
	controllers: [BoardsController],
})
export class BoardsModule {}
