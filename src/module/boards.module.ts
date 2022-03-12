import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersEntity } from '../database/entities/users.entity';
import { BoardsEntity } from '../database/entities/boards.entity';
import { HashTagEntity } from '../database/entities/hashTag.entity';

import { BoardsService } from '../service/boards.service';
import { BoardsController } from '../controller/board/boards.controller';
import { ImageService } from 'src/service/image.service';
import { HashtagService } from 'src/service/hashtag.service';
import { BoardImageEntity } from 'src/database/entities/BoardImage.entity';
import { BoardHashTagEntity } from 'src/database/entities/BoardHashTag.entity';

@Module({
	imports: [TypeOrmModule.forFeature([UsersEntity, BoardsEntity, HashTagEntity, BoardImageEntity, BoardHashTagEntity])],
	providers: [BoardsService, ImageService, HashtagService],
	controllers: [BoardsController],
})
export class BoardsModule {}
