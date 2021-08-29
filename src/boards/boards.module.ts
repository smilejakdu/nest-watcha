import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import { Users } from 'src/entities/Users';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Boards } from 'src/entities/Boards';
import { Comments } from 'src/entities/Comments';

@Module({
	imports: [TypeOrmModule.forFeature([Users, Boards, Comments])],
	providers: [BoardsService],
	controllers: [BoardsController],
})
export class BoardsModule {}
