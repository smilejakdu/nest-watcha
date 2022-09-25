import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashtagController } from '../controller/hashtag/hashtag.controller';
import { HashtagService } from '../service/hashtag.service';
import { BoardHashTagEntity } from 'src/database/entities/Board/BoardHashTag.entity';
import { HashtagRepository } from '../database/repository/hashtag.repository';
import { BoardsRepository } from '../database/repository/BoardRepository/boards.repository';
import {TypeOrmExModule} from "../shared/typeorm-ex.module";

@Module({
	imports: [
		TypeOrmExModule.forCustomRepository([
			BoardsRepository,
			HashtagRepository,
		]),
		TypeOrmModule.forFeature([
			BoardHashTagEntity,
		]),
	],
	providers: [HashtagService],
	controllers: [HashtagController],
	exports: [HashtagService],
})
export class HashtagModule {}
