import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardsEntity } from 'src/database/entities/BoardsEntity';
import { CommentsEntity } from 'src/database/entities/CommentsEntity';
import { UsersEntity } from 'src/database/entities/UsersEntity';
import { CommentsController } from '../controller/comments/comments.controller';
import { CommentsService } from '../service/comments.service';

@Module({
	imports: [TypeOrmModule.forFeature([UsersEntity, BoardsEntity, CommentsEntity])],
	controllers: [CommentsController],
	providers: [CommentsService],
})
export class CommentsModule {}
