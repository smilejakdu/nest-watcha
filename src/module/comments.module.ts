import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsController } from '../controller/comments/comments.controller';
import { CommentsService } from '../service/comments.service';
import { CommentsRepository } from '../database/repository/comments.repository';
import { BoardsRepository } from '../database/repository/BoardRepository/boards.repository';
import { UserRepository } from '../database/repository/user.repository';

@Module({
	imports: [TypeOrmModule.forFeature([UserRepository, CommentsRepository,BoardsRepository])],
	providers: [CommentsService],
	controllers: [CommentsController],
})
export class CommentsModule {}
