import { UpdateCommentDto } from './comments.controller.dto/update-comment.dto';
import {
	CreateCommentWithOpenAIDto,
	CreateReplyDto
} from "./comments.controller.dto/create-comment.dto";
import {Body, Controller, Param, ParseIntPipe, Patch, Query, Req, UseGuards} from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommentsService } from '../../service/comments.service';
import { UsersEntity } from 'src/database/entities/User/Users.entity';
import { DeleteCommentDto } from './comments.controller.dto/delete-comment.dto';
import { UserAuthGuard } from 'src/shared/auth/guard/user-auth.guard';
import {Request} from "express";
import { endPointGetDecorator } from 'src/decorators/end-point-get.decorator';
import { CoreResponseDto } from 'src/shared/CoreResponse';
import {endPointPostDecorator} from "../../decorators/end-point-post.decorator";
import { Pagination } from "../../shared/pagination";

@ApiInternalServerErrorResponse({ description: '서버 에러' })
@ApiTags('COMMENTS')
@Controller('comments')
export class CommentsController {
	constructor(
		private readonly commentsService: CommentsService,
	) {}

	@endPointGetDecorator('게시판 정보와 댓글 가져오기', '성공', CoreResponseDto,':id')
	async getComments(
		@Req() request: Request,
		@Query() page: Pagination,
		@Param('id', ParseIntPipe) id: number,
	) {
		const foundUser = request?.user as UsersEntity;
		const pageNumber = page?.pageNumber ?? 1;
		const size = page?.size ?? 5;

		return this.commentsService.findBoardAndComments(id,pageNumber, size);
	}

	@endPointPostDecorator('챗 GPT 에 질문을 하고 답변을 받는다.', '성공', CoreResponseDto, 'openai')
	async openAipostComments(
		@Req() request: Request,
		@Body() body: CreateCommentWithOpenAIDto,
	) {
		const {content} = body
		return this.commentsService.createCommentWithOpenAI(content);
	}

	@UseGuards(UserAuthGuard)
	@endPointPostDecorator('댓글 쓰기', '성공', CoreResponseDto, ':id')
	async postComments(
		@Param('id', ParseIntPipe) id: number,
		@Body('content') content: string,
		@Req() request: Request,
	) {
		const foundUser = request.user as UsersEntity;
		return this.commentsService.createComment(content, id, foundUser.id);
	}

	@ApiOperation({ summary: '댓글 수정' })
	@ApiOkResponse({
		description: '성공',
		type: UpdateCommentDto,
	})
	@UseGuards(UserAuthGuard)
	@Patch(':id')
	async updateComment(
		@Body('content') content: string,
		@Req() request: Request,
		@Query() query: UpdateCommentDto,
	) {
		return this.commentsService.updateComment(query, content);
	}

	@ApiOperation({ summary: '댓글 삭제' })
	@ApiOkResponse({
		description: '성공',
		type: DeleteCommentDto,
	})
	@Patch(':id')
	async deleteComment(
		@Param('id', ParseIntPipe) id: number,
	) {
		return this.commentsService.deleteComment(id);
	}

	@UseGuards(UserAuthGuard)
	@endPointPostDecorator('대댓글 작성', '성공', CoreResponseDto, '')
	async createReplyComment(
		@Body() body: CreateReplyDto,
		@Req() request: Request,
	) {
		const foundUser = request?.user as UsersEntity;
		const { comment_id, reply } = body;
		return this.commentsService.createReplyComment(reply,comment_id, foundUser.id)
	}
}
