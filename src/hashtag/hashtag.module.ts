import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardsEntity } from 'src/entities/BoardsEntity';
import { HashTagEntity } from '../entities/HashTagEntity';
import { HashtagController } from './hashtag.controller';
import { HashtagService } from './hashtag.service';
import { BoardHashTagEntity } from 'src/entities/BoardHashTagEntity';

@Module({
	imports: [TypeOrmModule.forFeature([HashTagEntity, BoardsEntity, BoardHashTagEntity])],
	providers: [HashtagService],
	controllers: [HashtagController],
	exports: [HashtagService],
})
export class HashtagModule {}
