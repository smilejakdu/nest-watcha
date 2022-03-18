import { UndefinedToNullInterceptor } from '../../shared/common/interceptors/undefinedToNull.interceptor';
import { Body, Controller, Get, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiCreatedResponse,
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
import { UsersService } from '../../service/users.service';
import { LoginRequestDto } from './users.controller.dto/logInDto/logIn.request.dto';
import { LoginResponseDto } from './users.controller.dto/logInDto/logIn.response.dto';
import { UserAuthGuard } from '../../shared/auth/guard/user-auth.guard';

export const BAD_REQUEST = 'bad request';

@ApiInternalServerErrorResponse({
	description: 'server error',
})
@UseInterceptors(UndefinedToNullInterceptor)
@ApiBadRequestResponse({ description: 'bad request' })
@ApiTags('USER')
@Controller('users')
export class UsersController {
	constructor(
		private readonly usersService: UsersService
	) {}

	@ApiOkResponse({
		description: 'success',
		type: UserDto,
	})
	@ApiOperation({ summary: '회원검색' })
	@ApiOkResponse({ description: '성공', type: 'application/json' })
	@Get('findUser')
	async findByUsername(@Body() data: UserFindRequestDto) {
		return await this.usersService.findByUsername(data.username);
	}

	@ApiCreatedResponse({
		description: 'success',
	})
	@ApiOperation({ summary: '회원가입' })
	@Post('signup')
	async signUp(@Body() data: SignUpRequestDto,@Res() res:Response) {
		const  responseSignUp = await this.usersService.signUp(data);
		return res.status(responseSignUp.statusCode).json({
			ok : responseSignUp.ok,
			statusCode : responseSignUp.statusCode,
			message : responseSignUp.message,
			data : responseSignUp.data,
		});
	}

	@ApiOkResponse({
		description: 'success',
		type: LoginResponseDto,
	})
	@ApiOperation({ summary: 'login' })
	@Post('login')
	async logIn(@Body() data: LoginRequestDto, @Res() res:Response) {
		const responseLogin =  await this.usersService.logIn(data);
		return res.status(responseLogin.statusCode).json({
			ok : responseLogin.ok,
			statusCode : responseLogin.statusCode,
			message : responseLogin.message,
			data : responseLogin.data,
		});
	}

	@ApiOperation({ summary: 'profile' })
	@ApiOkResponse({ description: '성공', type: 'application/json' })
	@UseGuards(UserAuthGuard)
	@Get('profile')
	async findMyProfile(@Req() req:any) {
		const {email} = req.user;
		return await this.usersService.findByUsername(email);
	}

	@ApiOperation({ summary: 'my_boards' })
	@ApiOkResponse({ description: '성공', type: 'application/json' })
	@UseGuards(UserAuthGuard)
	@Get('my_boards')
	async findMyBoards(@Req() req:any) {
		const {email} = req.user;
		return await this.usersService.findMyBoards(email);
	}
}
