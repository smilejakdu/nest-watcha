import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Boards } from 'src/entities/Boards';
import { Comments } from 'src/entities/Comments';
import { Users } from 'src/entities/Users';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
	imports: [TypeOrmModule.forFeature([Users, Boards, Comments])],
	controllers: [CommentsController],
	providers: [CommentsService],
})
export class CommentsModule {}
