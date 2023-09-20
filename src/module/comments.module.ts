import { Module } from '@nestjs/common';
import { CommentsController } from '../controller/comments/comments.controller';
import { CommentsService } from '../service/comments.service';
import { CommentsRepository } from '../database/repository/comments.repository';
import { BoardsRepository } from '../database/repository/BoardRepository/boards.repository';
import { UserRepository } from '../database/repository/user.repository';
import {TypeOrmExModule} from "../shared/typeorm/typeorm-ex.module";

@Module({
	imports: [
		TypeOrmExModule.forCustomRepository([
			UserRepository,
			BoardsRepository,
			CommentsRepository,
		]),
	],
	providers: [CommentsService],
	controllers: [CommentsController],
	exports: [CommentsService],
})
export class CommentsModule {}
