import { UpdateCommentDto } from './comments.controller.dto/update-comment.dto';
import { CreateCommentDto } from './comments.controller.dto/create-comment.dto';
import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommentsService } from '../../database/service/comments.service';
import { LoggedInGuard } from 'src/shared/auth/logged-in.guard';
import { User } from 'src/shared/common/decorator/user.decorator';
import { UsersEntity } from 'src/database/entities/UsersEntity';
import { DeleteCommentDto } from './comments.controller.dto/delete-comment.dto';

@ApiInternalServerErrorResponse({ description: '서버 에러' })
@ApiTags('COMMENTS')
@Controller('comments')
export class CommentsController {
	constructor(private commentsService: CommentsService) {}

	@ApiOperation({ summary: '댓글 가져오기' })
	@ApiOkResponse({
		description: '성공',
		type: CreateCommentDto,
	})
	@Get(':id')
	async getComments(@Param('id', ParseIntPipe) id: number) {
		return this.commentsService.findBoardAndComments(id);
	}

	@ApiOperation({ summary: '댓글 쓰기' })
	@ApiOkResponse({
		description: '성공',
		type: CreateCommentDto,
	})
	@UseGuards(new LoggedInGuard())
	@Post(':id')
	async postComments(
		@Param('id', ParseIntPipe) id: number,
		@Body('content') content: string,
		@User() user: UsersEntity,
	) {
		return await this.commentsService.createComment(content, id, user.id);
	}

	@ApiOperation({ summary: '댓글 수정' })
	@Patch(':id')
	@ApiOkResponse({
		description: '성공',
		type: UpdateCommentDto,
	})
	@UseGuards(new LoggedInGuard())
	async updateComment(@Body('content') content: string, @Param('id', ParseIntPipe) id: number) {
		return await this.commentsService.updateComment(content, id);
	}

	@ApiOperation({ summary: '댓글 삭제' })
	@Patch(':id')
	@ApiOkResponse({
		description: '성공',
		type: DeleteCommentDto,
	})
	@UseGuards(new LoggedInGuard())
	async deleteComment(@Param('id', ParseIntPipe) id: number) {
		return await this.commentsService.deleteComment(id);
	}
}