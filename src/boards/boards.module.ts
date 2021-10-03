import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Users } from '../entities/Users';
import { Boards } from '../entities/Boards';
import { Comments } from '../entities/Comments';
import { HashTag } from '../entities/HashTag';
import { BoardHashTag } from '../entities/BoardHashTag';
import { BoardImage } from '../entities/BoardImage';

import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';

@Module({
	imports: [TypeOrmModule.forFeature([Users, Boards, BoardImage, Comments, HashTag, BoardHashTag])],
	providers: [BoardsService],
	controllers: [BoardsController],
})
export class BoardsModule {}
