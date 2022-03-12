import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardsEntity } from 'src/database/entities/boards.entity';
import { CommentsEntity } from 'src/database/entities/comments.entity';
import { UsersEntity } from 'src/database/entities/users.entity';
import { CommentsController } from '../controller/comments/comments.controller';
import { CommentsService } from '../service/comments.service';

@Module({
	imports: [TypeOrmModule.forFeature([UsersEntity, BoardsEntity, CommentsEntity])],
	controllers: [CommentsController],
	providers: [CommentsService],
})
export class CommentsModule {}
