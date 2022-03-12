import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiCreatedResponse,
	ApiInternalServerErrorResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags
} from '@nestjs/swagger';
import { User } from 'src/shared/common/decorator/user.decorator';
import { UsersEntity } from 'src/database/entities/users.entity';
import { BoardsService } from '../../service/boards.service';
import { CreateBoardDto } from './board.controller.dto/create-board.dto';
import { DeleteBoardDto } from './board.controller.dto/delete-board.dto';
import { UpdateBoardDto } from './board.controller.dto/update-board.dto';
import { ImageService } from '../../service/image.service';
import { HashtagService } from '../../service/hashtag.service';

@ApiInternalServerErrorResponse({
	description: '서버 에러',
})
@ApiBadRequestResponse({ description: '잘못된 요청 파라미터' })
@ApiTags('BOARD')
@Controller('boards')
export class BoardsController {
	constructor(private boardsService: BoardsService, private imageService: ImageService, private hashtagService: HashtagService) {}

	@ApiOperation({ summary: '게시판 정보 가져오기' })
	@ApiOkResponse({
		description: '성공',
		type: CreateBoardDto,
	})
	@Get()
	async getBoards() {
		return this.boardsService.findAllBoards();
	}

	@ApiOkResponse({
		description: '성공',
		type: CreateBoardDto,
	})
	@ApiOperation({ summary: '내 게시판가져오기' })
	@Get('my_board')
	async getMyBoards(@User() user: UsersEntity) {
		const responseFoundMyBoard = await this.boardsService.findMyBoard(user.id);
		return responseFoundMyBoard;
	}

	@ApiCreatedResponse({
		description: '성공',
		type: CreateBoardDto,
	})
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
	@ApiOperation({ summary: '게시판수정하기' })
	@Put(':id')
	async updateBoard(@User() user: UsersEntity, @Param('id', ParseIntPipe) id: number, @Body() data: UpdateBoardDto) {
		return this.boardsService.updateBoard(id, data.title, data.content);
	}

	@ApiOkResponse({
		description: '성공',
		type: DeleteBoardDto,
	})
	@ApiOperation({ summary: '게시판삭제하기' })
	@Delete(':id')
	async deleteBoard(@User() user: UsersEntity, @Param('id', ParseIntPipe) id: number) {
		return this.boardsService.deleteBoardOne(id);
	}

	@Get('username')
	async findByUsername(@Query() query) {
		return this.boardsService.findByUsername(query.username);
	}
}
