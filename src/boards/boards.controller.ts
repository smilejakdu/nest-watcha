import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BoardsService } from './boards.service';

@ApiTags('BOARD')
@Controller('boards')
export class BoardsController {
	constructor(private boardsService: BoardsService) {}

	@ApiOperation({ summary: '내정보조회' })
	@ApiResponse({
		// swagger 에서 에럭 response 가 났을경우
		status: 500,
		description: '서버 에러',
	})
	@ApiResponse({
		// 알아서 status:200
		description: '성공',
		type: Board,
	})
	@Get()
	getBoards() {
		return;
	}
}
