import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import {
	ApiInternalServerErrorResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from '@nestjs/swagger';
import { log } from 'console';
import { LoggedInGuard } from 'src/auth/logged-in.guard';
import { SelectHashtagDto } from './dto/select-hashtag.dto';
import { HashtagService } from './hashtag.service';

@ApiInternalServerErrorResponse({
	description: '서버 에러',
})
@ApiTags('HASHTAG')
@Controller('hashtag')
export class HashtagController {
	constructor(private hashTagService: HashtagService) {}

	@ApiOperation({ summary: '해시태그 불러오기' })
	@UseGuards(new LoggedInGuard())
	@ApiOkResponse({
		description: '성공',
		type: SelectHashtagDto,
	})
	@Get()
	async getMyHashTag(@Body() data: SelectHashtagDto): Promise<object> {
		return this.hashTagService.getMyHashTag(data.hashtag);
	}
}
