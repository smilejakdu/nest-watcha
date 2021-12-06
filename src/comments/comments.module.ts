import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardsEntity } from 'src/entities/BoardsEntity';
import { CommentsEntity } from 'src/entities/CommentsEntity';
import { UsersEntity } from 'src/entities/UsersEntity';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
	imports: [TypeOrmModule.forFeature([UsersEntity, BoardsEntity, CommentsEntity])],
	controllers: [CommentsController],
	providers: [CommentsService],
})
export class CommentsModule {}
