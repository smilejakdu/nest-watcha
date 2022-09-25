import { UpdateCommentDto } from './comments.controller.dto/update-comment.dto';
import { CreateCommentDto } from './comments.controller.dto/create-comment.dto';
import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post} from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommentsService } from '../../service/comments.service';
import { User } from 'src/shared/common/decorator/user.decorator';
import { UsersEntity } from 'src/database/entities/User/users.entity';
import { DeleteCommentDto } from './comments.controller.dto/delete-comment.dto';

@ApiInternalServerErrorResponse({ description: '서버 에러' })
@ApiTags('COMMENTS')
@Controller('comments')
export class CommentsController {
	constructor(
		private readonly commentsService: CommentsService,
	) {}

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
	@Post(':id')
	async postComments(
		@Param('id', ParseIntPipe) id: number,
		@Body('content') content: string,
		@User() user: UsersEntity,
	) {
		return this.commentsService.createComment(content, id, user.id);
	}

	@ApiOperation({ summary: '댓글 수정' })
	@Patch(':id')
	@ApiOkResponse({
		description: '성공',
		type: UpdateCommentDto,
	})
	async updateComment(@Body('content') content: string, @Param('id', ParseIntPipe) id: number) {
		return this.commentsService.updateComment(content, id);
	}

	@ApiOperation({ summary: '댓글 삭제' })
	@Patch(':id')
	@ApiOkResponse({
		description: '성공',
		type: DeleteCommentDto,
	})
	async deleteComment(@Param('id', ParseIntPipe) id: number) {
		return this.commentsService.deleteComment(id);
	}
}
