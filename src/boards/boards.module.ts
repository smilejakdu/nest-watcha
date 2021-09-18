import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import { Users } from 'src/entities/Users';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Boards } from 'src/entities/Boards';
import { Comments } from 'src/entities/Comments';
import { HashTag } from 'src/entities/HashTag';
import { BoardHashTag } from 'src/entities/BoardHashTag';

@Module({
	imports: [TypeOrmModule.forFeature([Users, Boards, Comments , HashTag , BoardHashTag])],
	providers: [BoardsService],
	controllers: [BoardsController],
})
export class BoardsModule {}
