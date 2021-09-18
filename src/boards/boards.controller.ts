import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Put,
	UseGuards,
} from '@nestjs/common';
import {
	ApiOperation,
	ApiResponse,
	ApiTags,
	ApiOkResponse,
	ApiInternalServerErrorResponse,
	ApiCreatedResponse,
	ApiCookieAuth,
} from '@nestjs/swagger';
import { LoggedInGuard } from 'src/auth/logged-in.guard';
import { User } from 'src/common/decorator/user.decorator';
import { Users } from 'src/entities/Users';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { DeleteBoardDto } from './dto/delete-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Boards } from 'src/entities/Boards';

@ApiInternalServerErrorResponse({
	description: '서버 에러',
})
@ApiTags('BOARD')
@Controller('boards')
export class BoardsController {
	constructor(private boardsService: BoardsService) {}

	@ApiOperation({ summary: '게시판 정보 가져오기' })
	@ApiOkResponse({
		description: '성공',
		type: CreateBoardDto,
	})
	@Get()
	async getBoards() :Promise<object> {
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
	async getMyBoards(@User() user: Users):Promise<object> {
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
	async createBoard(@User() user: Users, @Body() data: CreateBoardDto) {
		return this.boardsService.createBoard(data.title, data.content , data.hashtag, user.id);
	}

	@ApiOkResponse({
		description: '성공',
		type: CreateBoardDto,
	})
	@ApiCookieAuth('connect.sid')
	@UseGuards(new LoggedInGuard())
	@ApiOperation({ summary: '게시판수정하기' })
	@Put(':id') 
	async updateBoard(
		@User() user: Users,
		@Param('id', ParseIntPipe) id: number,
		@Body() data: UpdateBoardDto,
	) {
		return this.boardsService.updateBoard(id, data.title, data.content);
	}

	@ApiOkResponse({
		description: '성공',
		type: DeleteBoardDto,
	})
	@ApiCookieAuth('connect.sid')
	@ApiOperation({ summary: '게시판삭제하기' })
	@Delete(':id')
	async deleteBoard(
		@User() user: Users,
		@Param('id', ParseIntPipe) id: number,
	) {
		return this.boardsService.deleteBoardOne(id);
	}
}
