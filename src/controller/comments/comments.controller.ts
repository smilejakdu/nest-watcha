import { UpdateCommentDto, UpdateReplyDto } from "./comments.controller.dto/update-comment.dto";
import {
	CreateCommentDto,
	CreateCommentWithOpenAIDto,
	CreateReplyDto
} from "./comments.controller.dto/create-comment.dto";
import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Put,
	Query,
	Req,
	UseGuards
} from "@nestjs/common";
import { ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommentsService } from '../../service/comments.service';
import { UsersEntity } from 'src/database/entities/User/Users.entity';
import { DeleteCommentDto } from "./comments.controller.dto/delete-comment.dto";
import { UserAuthGuard } from 'src/shared/auth/guard/user-auth.guard';
import {Request} from "express";

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

	@ApiOperation({ summary: '챗 GPT 에 질문을 하고 답변을 받는다.' })
	@ApiOkResponse({
		description: '성공',
	})
	@Post('openai')
	async openAipostComments(
		@Req() request: Request,
		@Body() body: CreateCommentWithOpenAIDto,
	) {
		const {content} = body
		return this.commentsService.createCommentWithOpenAI(content);
	}

	@ApiOperation({ summary: '댓글 쓰기' })
	@ApiOkResponse({
		description: '성공',
		type: CreateCommentDto,
	})
	@UseGuards(UserAuthGuard)
	@Post(':id')
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

	@ApiOperation({ summary: '대댓글 작성' })
	@ApiOkResponse({ description: '성공' })
	@UseGuards(UserAuthGuard)
	@Post('reply')
	async createReplyComment(
		@Body() body: CreateReplyDto,
		@Req() request: Request,
	) {
		const foundUser = request?.user as UsersEntity;
		const { comment_id, reply } = body;
		return this.commentsService.createReplyComment(reply,comment_id, foundUser.id)
	}

	@ApiOperation({ summary: '대댓글 수정' })
	@ApiOkResponse({ description: '성공'})
	@UseGuards(UserAuthGuard)
	@Put(':id/reply')
	async updateReplyComment(
		@Body() body: UpdateReplyDto,
		@Param('id', ParseIntPipe) id: number,
		@Req() request: Request,
	) {
		const foundUser = request?.user as UsersEntity;
		const { reply_content } = body;
		return this.commentsService.updateReplyComment(id, foundUser.id, reply_content)
	}

	@ApiOperation({ summary: '대댓글 삭제' })
	@ApiOkResponse({ description: '성공'})
	@UseGuards(UserAuthGuard)
	@Delete(':id/reply')
	async deleteReplyComment(
		@Param('id', ParseIntPipe) id: number,
		@Req() request: Request,
	) {
		const foundUser = request?.user as UsersEntity;
		return this.commentsService.deleteReplyComment(id, foundUser.id);
	}
}
