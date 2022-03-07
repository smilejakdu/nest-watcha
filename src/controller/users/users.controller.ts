import { UndefinedToNullInterceptor } from '../../shared/common/interceptors/undefinedToNull.interceptor';
import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiInternalServerErrorResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags
} from '@nestjs/swagger';
import { Response } from 'express';
// Dto
import { UserDto } from 'src/shared/common/dto/user.dto';
import { SignUpRequestDto } from './users.controller.dto/signUpDto/signUp.request.dto';
import { UserFindRequestDto } from './users.controller.dto/userFindDto/userFind.request.dto';
import { UsersService } from '../../database/service/users.service';
import { LocalAuthGuard } from 'src/shared/auth/guard/local-auth.guard';
import { User } from 'src/shared/common/decorator/user.decorator';
import { LoggedInGuard } from 'src/shared/auth/guard/logged-in.guard';
import { NotLoggedInGuard } from 'src/shared/auth/guard/not-logged-in.guard';
import { LoginRequestDto } from './users.controller.dto/logInDto/logIn.request.dto';
import { LoginResponseDto } from './users.controller.dto/logInDto/logIn.response.dto';

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
	async findUser(@Body() data: UserFindRequestDto,@Res() res:Response) {
		try {
			return  await this.usersService.findByUsername(data);
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
		const {username , password , phone , email} = data;
		try {
			const usersServiceResponse = await this.usersService.signUp(data);

			return res.status(HttpStatus.OK).json({
				user: usersServiceResponse,
			});
		} catch (err) {
			console.error(err);
			return res.status(HttpStatus.BAD_REQUEST).json({
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
			const usersServiceResponse = await this.usersService.logIn(data.username, data.password);

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
