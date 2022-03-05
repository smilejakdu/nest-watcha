import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersEntity } from '../entities/UsersEntity';
import { BoardsEntity } from '../entities/BoardsEntity';
import { HashTagEntity } from '../entities/HashTagEntity';

import { BoardsService } from '../service/boards.service';
import { BoardsController } from '../controller/board/boards.controller';
import { ImageService } from 'src/service/image.service';
import { HashtagService } from 'src/service/hashtag.service';
import { BoardImageEntity } from 'src/entities/BoardImageEntity';
import { BoardHashTagEntity } from 'src/entities/BoardHashTagEntity';

@Module({
	imports: [TypeOrmModule.forFeature([UsersEntity, BoardsEntity, HashTagEntity, BoardImageEntity, BoardHashTagEntity])],
	providers: [BoardsService, ImageService, HashtagService],
	controllers: [BoardsController],
})
export class BoardsModule {}
