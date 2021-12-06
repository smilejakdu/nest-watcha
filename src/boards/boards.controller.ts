import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import {
	ApiOperation,
	ApiTags,
	ApiOkResponse,
	ApiInternalServerErrorResponse,
	ApiCreatedResponse,
	ApiCookieAuth,
	ApiBadRequestResponse,
} from '@nestjs/swagger';
import { LoggedInGuard } from 'src/auth/logged-in.guard';
import { User } from 'src/common/decorator/user.decorator';
import { UsersEntity } from 'src/entities/UsersEntity';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { DeleteBoardDto } from './dto/delete-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { ImageService } from '../image/image.service';
import { HashtagService } from '../hashtag/hashtag.service';

@ApiInternalServerErrorResponse({
	description: '서버 에러',
})
@ApiBadRequestResponse({ description: '잘못된 요청 파라미터' })
@ApiTags('BOARD')
@Controller('boards')
export class BoardsController {
	constructor(
		private boardsService: BoardsService,
		private imageService: ImageService,
		private hashtagService: HashtagService,
	) {}

	@ApiOperation({ summary: '게시판 정보 가져오기' })
	@ApiOkResponse({
		description: '성공',
		type: CreateBoardDto,
	})
	@Get()
	async getBoards(): Promise<object> {
		return this.boardsService.findAllBoards();
	}

	@ApiOkResponse({
		description: '성공',
		type: CreateBoardDto,
	})
	@ApiCookieAuth('connect.sid')
	@UseGuards(new LoggedInGuard())
	@ApiOperation({ summary: '내 게시판가져오기' })
	@Get('my_board')
	async getMyBoards(@User() user: UsersEntity): Promise<object> {
		return this.boardsService.findMyBoard(user.id);
	}

	@ApiCreatedResponse({
		description: '성공',
		type: CreateBoardDto,
	})
	@ApiCookieAuth('connect.sid')
	@UseGuards(new LoggedInGuard())
	@ApiOperation({ summary: '게시판작성하기' })
	@Post()
	async createBoard(@User() user: UsersEntity, @Body() data) {
		const boardId = await this.boardsService.createBoard(data.title, data.content, user.id);
		await this.imageService.insertImages(boardId, data.imagePath);
		await this.hashtagService.createHashTag(boardId, data.hashtag);
	}

	@ApiOkResponse({
		description: '성공',
		type: CreateBoardDto,
	})
	@ApiCookieAuth('connect.sid')
	@UseGuards(new LoggedInGuard())
	@ApiOperation({ summary: '게시판수정하기' })
	@Put(':id')
	async updateBoard(@User() user: UsersEntity, @Param('id', ParseIntPipe) id: number, @Body() data: UpdateBoardDto) {
		return this.boardsService.updateBoard(id, data.title, data.content);
	}

	@ApiOkResponse({
		description: '성공',
		type: DeleteBoardDto,
	})
	@ApiCookieAuth('connect.sid')
	@ApiOperation({ summary: '게시판삭제하기' })
	@Delete(':id')
	async deleteBoard(@User() user: UsersEntity, @Param('id', ParseIntPipe) id: number) {
		return this.boardsService.deleteBoardOne(id);
	}

	@Get('nickname')
	async findByNickname(@Body() data) {
		return this.boardsService.findByNickname(data.nickname);
	}
}
