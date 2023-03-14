import { Controller, Get, Query } from '@nestjs/common';

import { ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { SelectHashtagDto } from './hashtag.controller.dto/select-hashtag.dto';
import { HashtagService } from '../../service/hashtag.service';
import {endPointGetDecorator} from "../../decorators/end-point-get.decorator";
import {CoreResponse, CoreResponseDto} from "../../shared/CoreResponse";

@ApiInternalServerErrorResponse({
	description: '서버 에러',
})
@ApiTags('HASHTAG')
@Controller('hashtag')
export class HashtagController {
	constructor(private hashTagService: HashtagService) {}

	@endPointGetDecorator('해시태그 불러오기', '성공', CoreResponseDto,'')
	async getMyHashTag(@Query() data: SelectHashtagDto) {
		return this.hashTagService.getMyHashTag(data.hashtag);
	}
}
