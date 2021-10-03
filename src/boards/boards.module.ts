import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Users } from '../entities/Users';
import { Boards } from '../entities/Boards';
import { HashTag } from '../entities/HashTag';

import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import { ImageService } from 'src/image/image.service';
import { HashtagService } from 'src/hashtag/hashtag.service';
import { BoardImage } from 'src/entities/BoardImage';
import { BoardHashTag } from 'src/entities/BoardHashTag';

@Module({
	imports: [TypeOrmModule.forFeature([Users, Boards, HashTag, BoardImage, BoardHashTag])],
	providers: [BoardsService, ImageService, HashtagService],
	controllers: [BoardsController],
})
export class BoardsModule {}
