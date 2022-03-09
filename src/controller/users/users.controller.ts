import { UndefinedToNullInterceptor } from '../../shared/common/interceptors/undefinedToNull.interceptor';
import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseInterceptors } from '@nestjs/common';
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
import { UsersService } from '../../database/service/users.service';
import { LoginRequestDto } from './users.controller.dto/logInDto/logIn.request.dto';
import { LoginResponseDto } from './users.controller.dto/logInDto/logIn.response.dto';
import { isNil } from 'lodash';

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

	@ApiOkResponse({
		description: 'success',
		type: UserDto,
	})
	@ApiOperation({ summary: '회원검색' })
	@ApiOkResponse({ description: '성공', type: 'application/json' })
	@Get('findUser')
	async findByUsername(@Body() data: UserFindRequestDto) {
		return await this.usersService.findByUsername(data);
	}

	@ApiCreatedResponse({
		description: 'success',
	})
	@ApiOperation({ summary: '회원가입' })
	@Post('signup')
	async signUp(@Body() data: SignUpRequestDto,@Res() res:Response) {
		return await this.usersService.signUp(data);
	}

	@ApiOkResponse({
		description: 'success',
		type: LoginResponseDto,
	})
	@ApiOperation({ summary: '로그인' })
	@Post('login')
	async logIn(@Body() data: LoginRequestDto, @Res() res:Response) {
		const responseLogIn =  await this.usersService.logIn(data);
		if(isNil(responseLogIn.data)) {
			return res.status(HttpStatus.BAD_REQUEST).json({
				ok: responseLogIn.ok,
				statusCode: responseLogIn.statusCode,
				message: responseLogIn.message
			});
		}
		return res.status(HttpStatus.OK).json({
			ok:responseLogIn.ok,
			statusCode : responseLogIn.statusCode,
			message: responseLogIn.message,
			data:responseLogIn.data
		});
	}

	@ApiOperation({ summary: '로그아웃' })
	@ApiOkResponse({ description: '성공', type: 'application/json' })
	@Post('logout')
	logOut(@Req() req, @Res() res: Response) {
		req.logout();
		res.clearCookie('connect.sid', { httpOnly: true });
		res.send('ok');
	}
}
