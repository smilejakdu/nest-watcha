import { UndefinedToNullInterceptor } from './../common/interceptors/undefinedToNull.interceptor';
import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
// Dto
import { UserDto } from 'src/common/dto/user.dto';
import { SignUpRequestDto } from './dto/signUpDto/signUp.request.dto';
import { UserFindRequestDto } from './dto/userFindDto/userFind.request.dto';
import { UsersService } from './users.service';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { User } from 'src/common/decorator/user.decorator';
import { LoggedInGuard } from 'src/auth/logged-in.guard';
import { NotLoggedInGuard } from 'src/auth/not-logged-in.guard';
import { LoginRequestDto } from './dto/logInDto/logIn.request.dto';
import { LoginResponseDto } from './dto/logInDto/logIn.response.dto';
import { log } from 'console';

export const BAD_REQUEST = 'bad request';

@ApiInternalServerErrorResponse({
	description: 'server error',
})
@UseInterceptors(UndefinedToNullInterceptor)
@ApiBadRequestResponse({ description: 'bad request' })
@ApiTags('USER')
@Controller('users')
export class UsersController {
	constructor(private usersService: UsersService) {}

	@ApiOperation({ summary: '내정보조회' })
	@ApiOkResponse({ description: '성공', type: 'application/json' })
	@UseGuards(new LocalAuthGuard())
	@Get()
	getUsers(@User() user) {
		return user || false;
	}

	@ApiOkResponse({
		description: 'success',
		type: UserDto,
	})
	@ApiOperation({ summary: '회원검색' })
	@ApiOkResponse({ description: '성공', type: 'application/json' })
	@Get('findUser')
	async findUser(@Body() data: UserFindRequestDto) {
		try {
			const { id, nickname } = data;
			return await this.usersService.findByNickname({ id, nickname });
		} catch (err) {
			console.error(err);
		}
	}

	@ApiOkResponse({
		description: 'success',
		type: UserDto,
	})
	@UseGuards(new NotLoggedInGuard())
	@ApiOperation({ summary: '회원가입' })
	@Post('signup')
	async signUp(@Body() data: SignUpRequestDto, @Res() res: Response) {
		try {
			const usersServiceResponse = await this.usersService.signUp(data.nickname, data.password);

			res.status(HttpStatus.OK).json({
				user: usersServiceResponse,
			});
		} catch (err) {
			console.error(err);
			res.status(HttpStatus.BAD_REQUEST).json({
				error: BAD_REQUEST,
			});
		}
	}

	@ApiOkResponse({
		description: 'success',
		type: LoginResponseDto,
	})
	@ApiOperation({ summary: '로그인' })
	@UseGuards(new NotLoggedInGuard())
	@Post('login')
	async logIn(@Body() data: LoginRequestDto, @Res() res: Response) {
		try {
			const usersServiceResponse = await this.usersService.logIn(data.nickname, data.password);

			return res.status(HttpStatus.OK).json({
				user: usersServiceResponse,
			});
		} catch (error) {
			console.log(error);
			res.status(HttpStatus.BAD_REQUEST).json({
				error: error,
			});
		}
	}

	@UseGuards(new LoggedInGuard())
	@ApiOperation({ summary: '로그아웃' })
	@ApiOkResponse({ description: '성공', type: 'application/json' })
	@Post('logout')
	logOut(@Req() req, @Res() res: Response) {
		req.logout();
		res.clearCookie('connect.sid', { httpOnly: true });
		res.send('ok');
	}
}
