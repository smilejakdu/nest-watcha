import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
	ApiOperation,
	ApiResponse,
	ApiTags,
	ApiOkResponse,
	ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { LoggedInGuard } from 'src/auth/logged-in.guard';
import { User } from 'src/common/decorator/user.decorator';
import { Users } from 'src/entities/Users';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';

@ApiTags('BOARD')
@Controller('boards')
export class BoardsController {
	constructor(private boardsService: BoardsService) {}

	@ApiOperation({ summary: '게시판 정보 가져오기' })
	@ApiInternalServerErrorResponse({
		// swagger 에서 에럭 response 가 났을경우
		// status: 500,
		description: '서버 에러',
	})
	@ApiOkResponse({
		// 알아서 status:200
		description: '성공',
		type: CreateBoardDto,
	})
	@Get()
	getBoards() {
		return;
	}

	@ApiOkResponse({
		// 알아서 status:200
		description: '성공',
		type: CreateBoardDto,
	})
	@UseGuards(new LoggedInGuard())
	@ApiOperation({ summary: '게시판작성하기' })
	@Post()
	async createBoard(@User() user: Users, data: CreateBoardDto) {}
}
