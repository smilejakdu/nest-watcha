import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Boards } from 'src/entities/Boards';
import { HashTag } from '../entities/HashTag';
import { HashtagController } from './hashtag.controller';
import { HashtagService } from './hashtag.service';
import { BoardHashTag } from 'src/entities/BoardHashTag';
``;

@Module({
	imports: [TypeOrmModule.forFeature([HashTag, Boards, BoardHashTag])],
	providers: [HashtagService],
	controllers: [HashtagController],
	exports: [HashtagService],
})
export class HashtagModule {}
