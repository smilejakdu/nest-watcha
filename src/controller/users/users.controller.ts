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
	constructor(private usersService: UsersService) {}

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
		const result = await this.usersService.signUp(data);
		console.log('result:',result);
		return res.status(result.statusCode).json({
			ok : result.ok,
			statusCode : result.statusCode,
			message : result.message,
			data : result.data,
		});
	}

	@ApiOkResponse({
		description: 'success',
		type: LoginResponseDto,
	})
	@ApiOperation({ summary: '로그인' })
	@Post('login')
	async logIn(@Body() data: LoginRequestDto, @Res() res:Response) {
		return await this.usersService.logIn(data);
	}

	@ApiOperation({ summary: '로그아웃' })
	@ApiOkResponse({ description: '성공', type: 'application/json' })
	@UseGuards(UserAuthGuard)
	@Get('profile')
	async myProfile(@Req() req:any) {
		const {username} = req.user;
		return await this.usersService.findByUsername(username);
	}
}
