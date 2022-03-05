import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardsEntity } from 'src/database/entities/BoardsEntity';
import { HashTagEntity } from '../database/entities/HashTagEntity';
import { HashtagController } from '../controller/hashtag/hashtag.controller';
import { HashtagService } from '../database/service/hashtag.service';
import { BoardHashTagEntity } from 'src/database/entities/BoardHashTagEntity';

@Module({
	imports: [TypeOrmModule.forFeature([HashTagEntity, BoardsEntity, BoardHashTagEntity])],
	providers: [HashtagService],
	controllers: [HashtagController],
	exports: [HashtagService],
})
export class HashtagModule {}
