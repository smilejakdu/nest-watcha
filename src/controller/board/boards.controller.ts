import {
	BadRequestException,
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
		pagination.page ? (pagination.page = Number(pagination.page)) : (pagination.page = 1);
		pagination.limit ? (pagination.limit = Number(pagination.limit)) : (pagination.limit = 10);

		return this.boardsService.findAllBoards(pagination);
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
		@Res() res: Response,
	) {
		const foundUser = request?.user as UsersEntity;
		if (!foundUser) {
			throw new BadRequestException('로그인이 필요합니다.');
		}

		const responseBoard = await this.boardsService.createBoard(data, foundUser.id);
		if(!responseBoard.ok) {
			throw new BadRequestException('게시판만들기 실패하였습니다.');
		}

		const responseImage = await this.boardImageService.insertImages(responseBoard.data, data.imagePath);
		if(!responseImage.ok) {
			throw new BadRequestException('이미지만들기 실패하였습니다.');
		}
		await this.hashtagService.createHashTag(responseBoard.data.id, data.hashtag);

		return SuccessFulResponse(responseBoard,HttpStatus.CREATED);
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
		@Req() req:any,
		@Param('id', ParseIntPipe) id: number,
	) {
		return this.boardsService.deleteBoardOne(id);
	}
}
