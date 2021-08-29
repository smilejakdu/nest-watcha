import { UndefinedToNullInterceptor } from './../common/interceptors/undefinedToNull.interceptor';
import {
	Body,
	Controller,
	Get,
	Post,
	Req,
	Res,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import {
	ApiOkResponse,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { UserDto } from 'src/common/dto/user.dto';
import { LoginRequestDto } from './dto/login.request.dto';
import { SignUpRequestDto } from './dto/signup.request.dto';
import { UsersService } from './users.service';
import { Token } from 'src/common/decorator/token.decorator';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { User } from 'src/common/decorator/user.decorator';
import { LoggedInGuard } from 'src/auth/logged-in.guard';
import { NotLoggedInGuard } from 'src/auth/not-logged-in.guard';

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
	getUsers(@User() user) {
		return user || false;
	}

	@ApiOkResponse({
		// 알아서 status:200
		description: '성공',
		type: UserDto,
	})
	@UseGuards(new NotLoggedInGuard())
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
	@UseGuards(new LocalAuthGuard())
	@Post('login')
	logIn(@User() user) {
		return user;
	}

	@UseGuards(new LoggedInGuard())
	@ApiOperation({ summary: '로그아웃' })
	@Post('logout')
	logOut(@Req() req, @Res() res) {
		req.logout();
		res.send('ok');
	}
}
