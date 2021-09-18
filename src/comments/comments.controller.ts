import { UpdateCommentDto } from './dto/update-comment.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import {
	Body,
	Controller,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common';
import {
	ApiInternalServerErrorResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { LoggedInGuard } from 'src/auth/logged-in.guard';
import { User } from 'src/common/decorator/user.decorator';
import { Users } from 'src/entities/Users';
import { DeleteCommentDto } from './dto/delete-comment.dto';

@ApiInternalServerErrorResponse({description: '서버 에러'})
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
		@User() user: Users,
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
	async updateComment(
		@Body('content') content: string,
		@Param('id', ParseIntPipe) id: number,
	) {
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
