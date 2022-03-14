import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersEntity } from '../database/entities/users.entity';
import { HashTagEntity } from '../database/entities/hashTag.entity';

import { BoardsService } from '../service/boards.service';
import { BoardsController } from '../controller/board/boards.controller';
import { BoardImageEntity } from 'src/database/entities/BoardImage.entity';
import { BoardHashTagEntity } from 'src/database/entities/BoardHashTag.entity';
import { BoardsRepository } from '../database/repository/boards.repository';

@Module({
	imports: [TypeOrmModule.forFeature([UsersEntity, BoardsRepository])],
	providers: [BoardsService],
	controllers: [BoardsController],
})
export class BoardsModule {}
