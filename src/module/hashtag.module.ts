import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardsEntity } from 'src/database/entities/boards.entity';
import { HashTagEntity } from '../database/entities/hashTag.entity';
import { HashtagController } from '../controller/hashtag/hashtag.controller';
import { HashtagService } from '../service/hashtag.service';
import { BoardHashTagEntity } from 'src/database/entities/BoardHashTag.entity';

@Module({
	imports: [TypeOrmModule.forFeature([HashTagEntity, BoardsEntity, BoardHashTagEntity])],
	providers: [HashtagService],
	controllers: [HashtagController],
	exports: [HashtagService],
})
export class HashtagModule {}
