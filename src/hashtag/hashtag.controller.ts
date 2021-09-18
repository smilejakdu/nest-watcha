import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoggedInGuard } from 'src/auth/logged-in.guard';
import { User } from 'src/common/decorator/user.decorator';
import { Users } from 'src/entities/Users';
import { CreateHashtagDto } from './dto/create-hashtag.dto';
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
		type: CreateHashtagDto,
	})
	@Get()
	async getMyHashTag(@User() user:Users , @Body() data: CreateHashtagDto ) :Promise<object> {
		return this.hashTagService.getMyHashTag(user.id , data.hashtag);
	}


}
