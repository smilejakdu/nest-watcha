import { UndefinedToNullInterceptor } from './../common/interceptors/undefinedToNull.interceptor';
import { Body, Controller, Get, Post, Req, Res, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from 'src/common/dto/user.dto';
import { LoginRequestDto } from './dto/login.request.dto';
import { SignUpRequestDto } from './dto/signup.request.dto';
import { UsersService } from './users.service';
import { Token } from 'src/common/decorator/token.decorator';

@UseInterceptors(UndefinedToNullInterceptor)
@ApiTags('USER')
@Controller('users')
export class UsersController {
	constructor(private usersService: UsersService) {}

	@ApiOperation({ summary: '내정보조회' })
	@ApiResponse({
		// swagger 에서 에럭 response 가 났을경우
		status: 500,
		description: '서버 에러',
	})
	@Get()
	getUsers(@Token() req) {
		return req.user;
	}

	@ApiOkResponse({
		// 알아서 status:200
		description: '성공',
		type: UserDto,
	})
	@ApiOperation({ summary: '회원가입' })
	@Post('signup')
	async signUp(@Body() data: SignUpRequestDto) {
		await this.usersService.signUp(data.nickname, data.password);
	}

	@ApiOkResponse({
		// 알아서 status:200
		description: '성공',
		type: UserDto,
	})
	@ApiOperation({ summary: '로그인' })
	@Post('login')
	login(@Body() data: LoginRequestDto) {}

	@ApiOperation({ summary: '로그아웃' })
	@Post('logout')
	logOut(@Req() req, @Res() res) {
		req.logout();
		res.send('ok');
	}
}
