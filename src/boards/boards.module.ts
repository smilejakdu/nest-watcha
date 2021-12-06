import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersEntity } from '../entities/UsersEntity';
import { BoardsEntity } from '../entities/BoardsEntity';
import { HashTagEntity } from '../entities/HashTagEntity';

import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import { ImageService } from 'src/image/image.service';
import { HashtagService } from 'src/hashtag/hashtag.service';
import { BoardImageEntity } from 'src/entities/BoardImageEntity';
import { BoardHashTagEntity } from 'src/entities/BoardHashTagEntity';

@Module({
	imports: [TypeOrmModule.forFeature([UsersEntity, BoardsEntity, HashTagEntity, BoardImageEntity, BoardHashTagEntity])],
	providers: [BoardsService, ImageService, HashtagService],
	controllers: [BoardsController],
})
export class BoardsModule {}
