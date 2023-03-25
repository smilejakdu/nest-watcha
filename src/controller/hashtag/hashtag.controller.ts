import { Controller, Query } from '@nestjs/common';

import { ApiInternalServerErrorResponse, ApiTags } from '@nestjs/swagger';

import { SelectHashtagDto } from './hashtag.controller.dto/select-hashtag.dto';
import { HashtagService } from '../../service/hashtag.service';
import { endPointGetDecorator } from "../../decorators/end-point-get.decorator";
import { CoreResponseDto } from "../../shared/CoreResponse";

@ApiInternalServerErrorResponse({
	description: '서버 에러',
})
@ApiTags('HASHTAG')
@Controller('hashtag')
export class HashtagController {
	constructor(private hashTagService: HashtagService) {}

	@endPointGetDecorator('해시태그에 따른 뮤비 가져오기', '성공', CoreResponseDto,'')
	async getMyHashTag(@Query() query: SelectHashtagDto) {
		const { hashtag } = query;
		return await this.hashTagService.getMyHashTag(hashtag);
	}
}
