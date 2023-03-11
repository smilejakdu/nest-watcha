import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Param,
	ParseIntPipe,
	Post,
	Put,
	Query,
	Req,
	Res,
	UseGuards
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiCreatedResponse,
	ApiInternalServerErrorResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags
} from '@nestjs/swagger';
import { CreateBoardDto } from './board.controller.dto/create-board.dto';
import { DeleteBoardDto } from './board.controller.dto/delete-board.dto';
import { UpdateBoardDto } from './board.controller.dto/update-board.dto';
import { UserAuthGuard } from '../../shared/auth/guard/user-auth.guard';
import { BoardImageService } from '../../service/boardImage.service';
import { BoardsService } from '../../service/boards.service';
import { HashtagService } from '../../service/hashtag.service';
import { Pagination } from '../../shared/pagination';
import { Response, Request } from 'express';
import { SuccessFulResponse } from '../../shared/CoreResponse';
import { UsersEntity } from 'src/database/entities/User/Users.entity';

const logAndReturn = <T extends string|number>(input: T): T => {
	console.log('input :', input);
	return input;
};

@ApiInternalServerErrorResponse({
	description: '서버 에러',
})
@ApiBadRequestResponse({ description: '잘못된 요청 파라미터' })
@ApiTags('BOARD')
@Controller('boards')
export class BoardsController {
	constructor(
		private readonly boardsService : BoardsService,
		private readonly boardImageService: BoardImageService,
		private readonly hashtagService : HashtagService,
	) {}

	@ApiOperation({ summary: '게시판 이미지 모두 가져오기' })
	@ApiOkResponse({
		description: '성공',
		type: CreateBoardDto,
	})
	@Get('image')
	async getBoardImage() {
		return this.boardImageService.findAllImages();
	}

	@ApiOkResponse({
		description: '성공',
	})
	@ApiOperation({ summary: '게시판 모두 가져오기' })
	@Get('')
	async getAllBoards(@Query() pagination: Pagination) {
		return this.boardsService.findAllBoards(pagination.pageNumber);
	}

	@ApiCreatedResponse({
		description: '성공',
		type: CreateBoardDto,
	})
	@UseGuards(UserAuthGuard)
	@ApiOperation({ summary: '게시판작성하기' })
	@Post()
	async createBoard(
		@Req() request: Request,
		@Body() data: CreateBoardDto,
	) {
		const foundUser = request?.user as UsersEntity;

		return await this.boardsService.createBoard(data, foundUser.id);
	}

	@ApiOkResponse({
		description: '성공',
		type: CreateBoardDto,
	})
	@UseGuards(UserAuthGuard)
	@ApiOperation({ summary: '게시판수정하기' })
	@Put(':id')
	async updateBoard(
		@Req() req: Request,
		@Param('id', ParseIntPipe) id: number,
		@Body() data: UpdateBoardDto) {
		return this.boardsService.updateBoard(id, data);
	}

	@ApiOkResponse({
		description: '성공',
		type: DeleteBoardDto,
	})
	@UseGuards(UserAuthGuard)
	@ApiOperation({ summary: '게시판삭제하기' })
	@Delete(':id')
	async deleteBoard(
		@Req() req: Request,
		@Param('id', ParseIntPipe) id: number,
	) {
		return this.boardsService.deleteBoardOne(id);
	}
}
