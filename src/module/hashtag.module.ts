import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashtagController } from '../controller/hashtag/hashtag.controller';
import { HashtagService } from '../service/hashtag.service';
import { BoardHashTagEntity } from 'src/database/entities/BoardHashTag.entity';
import { HashtagRepository } from '../database/repository/hashtag.repository';
import { BoardsRepository } from '../database/repository/boards.repository';

@Module({
	imports: [TypeOrmModule.forFeature([HashtagRepository, BoardsRepository, BoardHashTagEntity])],
	providers: [HashtagService],
	controllers: [HashtagController],
	exports: [HashtagService],
})
export class HashtagModule {}
