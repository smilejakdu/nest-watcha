import { Body, Controller, Get, UseGuards } from '@nestjs/common';

import { ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { SelectHashtagDto } from './hashtag.controller.dto/select-hashtag.dto';
import { HashtagService } from '../../service/hashtag.service';

@ApiInternalServerErrorResponse({
	description: '서버 에러',
})
@ApiTags('HASHTAG')
@Controller('hashtag')
export class HashtagController {
	constructor(private hashTagService: HashtagService) {}

	@ApiOperation({ summary: '해시태그 불러오기' })
	@ApiOkResponse({
		description: '성공',
		type: SelectHashtagDto,
	})
	@Get()
	async getMyHashTag(@Body() data: SelectHashtagDto): Promise<object> {
		return this.hashTagService.getMyHashTag(data.hashtag);
	}
}
