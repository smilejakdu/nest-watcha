import { UndefinedToNullInterceptor } from '../../shared/common/interceptors/undefinedToNull.interceptor';
import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
// Dto
import { SignUpRequestDto } from './users.controller.dto/signUpDto/signUp.request.dto';
import { UsersService } from '../../service/users.service';
import { LoginRequestDto } from './users.controller.dto/logInDto/logIn.request.dto';
import { LoginResponseDto } from './users.controller.dto/logInDto/logIn.response.dto';
import { UserAuthGuard } from '../../shared/auth/guard/user-auth.guard';
import { LoginType, UsersEntity } from '../../database/entities/User/Users.entity';
import { Response } from 'express';
import { User } from 'src/shared/common/decorator/user.decorator';


export const BAD_REQUEST = 'bad request';

@ApiInternalServerErrorResponse({
	description: 'server error',
})
@UseInterceptors(UndefinedToNullInterceptor)
@ApiBadRequestResponse({ description: 'bad request' })
@ApiTags('USERS')
@Controller('users')
export class UsersController {
	constructor(
		private readonly usersService: UsersService,
	) {}

	@ApiOperation({ summary: '회원검색 by id' })
	@ApiOkResponse({ description: '성공', type: 'application/json' })
	@Get(':id')
	async get(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
		return this.usersService.findById(id);
	}

	@ApiCreatedResponse({ description: 'success' })
	@ApiOperation({ summary: '회원가입' })
	@Post('signup')
	async signUp(@Body() data: SignUpRequestDto, @Res() res: Response) {
		const responseSignUp = await this.usersService.signUp(data);
		return res.status(responseSignUp.statusCode).json(responseSignUp);
	}

	@ApiOperation({ summary: 'login' })
	@ApiOkResponse({
		description: 'success',
		type: LoginResponseDto,
	})
	@Post('login')
	async logIn(@Body() data: LoginRequestDto, @Res() res: Response) {
		const responseLogin = await this.usersService.logIn(data);
		return res.status(responseLogin.statusCode).json(responseLogin);
	}

	@ApiOperation({ summary: 'profile' })
	@ApiOkResponse({ description: '성공', type: 'application/json' })
	@UseGuards(UserAuthGuard)
	@Get('profile')
	async findMyProfile(@Res() res:Response, @User() user:UsersEntity){
		const responseUserByEmail = await this.usersService.findById(user.id);
		return res.status(responseUserByEmail.statusCode).json(responseUserByEmail);
	}

	@ApiOperation({ summary: 'my_boards' })
	@ApiOkResponse({ description: '성공', type: 'application/json' })
	@UseGuards(UserAuthGuard)
	@Get('my_boards')
	async findMyBoards(@Req() req: any) {
		const { email } = req.user;
		return this.usersService.findMyBoards(email);
	}

	@ApiOperation({ summary: 'kakao_login' })
	@ApiOkResponse({ description: '성공', type: 'application/json' })
	@Get('/kakao/callback')
	async kakaoCallback(@Req() req: any, @Res() res: Response) {
		const data: { foundUser: any; kakaoUserData: any } = await this.usersService.checkRegister(LoginType.KAKAO, req.headers.access_token);
		let userId = data.foundUser?.id;
		if (!data.foundUser) {
			const result = await this.usersService.socialSignUp(data.kakaoUserData, LoginType.KAKAO);
			userId = result.data;
		}

		const foundUser = await this.usersService.findById(userId);
		const accessToken = await this.usersService.createToken(foundUser.data);

		res.cookie('accessToken', accessToken.accessToken, {
			domain: 'localhost',
			expires: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
			httpOnly: true,
			secure: true,
		});
		return res.status(foundUser.statusCode).json(foundUser);
	}
}
