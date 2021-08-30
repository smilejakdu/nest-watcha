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
} from '@nestjs/swagger';
import { LoggedInGuard } from 'src/auth/logged-in.guard';
import { User } from 'src/common/decorator/user.decorator';
import { Users } from 'src/entities/Users';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { DeleteBoardDto } from './dto/delete-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@ApiInternalServerErrorResponse({
	description: '서버 에러',
})
@ApiTags('BOARD')
@Controller('boards')
export class BoardsController {
	constructor(private boardsService: BoardsService) {}

	@ApiOperation({ summary: '게시판 정보 가져오기' })
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
	@ApiOperation({ summary: '내 게시판가져오기' })
	@Get()
	async getMyBoards(@User() user: Users) {
		return this.boardsService.findMyBoard(user.id);
	}

	@ApiCreatedResponse({
		// 알아서 status:200
		description: '성공',
		type: CreateBoardDto,
	})
	@UseGuards(new LoggedInGuard())
	@ApiOperation({ summary: '게시판작성하기' })
	@Post()
	async createBoard(@User() user: Users, data: CreateBoardDto) {
		return this.boardsService.createBoard(data.title, data.content, user.id);
	}

	@ApiOkResponse({
		// 알아서 status:200
		description: '성공',
		type: CreateBoardDto,
	})
	@UseGuards(new LoggedInGuard())
	@ApiOperation({ summary: '게시판수정하기' })
	@Put(':id') // @Put(:id) 하는게 나을까 ?? 아니면 body 로 다 보낼까 ?
	async updateBoard(
		@User() user: Users,
		@Param('id', ParseIntPipe) id: number,
		data: UpdateBoardDto,
	) {
		return this.boardsService.updateBoard(id, data.title, data.content);
	}

	@ApiOkResponse({
		// 알아서 status:200
		description: '성공',
		type: DeleteBoardDto,
	})
	@ApiOperation({ summary: '게시판삭제하기' })
	@Delete(':id')
	async deleteBoard(
		@User() user: Users,
		@Param('id', ParseIntPipe) id: number,
	) {
		return this.boardsService.deleteBoardOne(id);
	}
}
