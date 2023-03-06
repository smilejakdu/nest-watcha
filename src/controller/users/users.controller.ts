import { UndefinedToNullInterceptor } from '../../shared/common/interceptors/undefinedToNull.interceptor';
import {
	Body,
	Controller,
	Get, HttpStatus, NotFoundException,
	Post,
	Put,
	Req,
	Res,
	UseGuards,
	UseInterceptors
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
// Dto
import { SignUpRequestDto } from './users.controller.dto/signUpDto/signUp.request.dto';
import { UsersService } from '../../service/users.service';
import { LoginRequestDto } from './users.controller.dto/logInDto/logIn.request.dto';
import { LoginResponseDto } from './users.controller.dto/logInDto/logIn.response.dto';
import { UserAuthGuard } from '../../shared/auth/guard/user-auth.guard';
import { LoginType, UsersEntity } from '../../database/entities/User/Users.entity';
import { Response, Request } from 'express';
import { UserRepository } from 'src/database/repository/user.repository';
import {UpdateUserRequestDto} from "./users.controller.dto/updateUser.request.dto";
import { GoogleGuard } from 'src/guards/google.guard';
import { NaverGuard } from 'src/guards/naver.guard';


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
		private readonly usersRepository: UserRepository,
	) {}

	@ApiOperation({ summary: 'my_profile' })
	@UseGuards(UserAuthGuard)
	@Get('my_profile')
	async findMyProfile(
		@Res() res:Response,
		@Req() req:Request,
	) {
		const foundUser = req?.user as UsersEntity;
		delete foundUser.password;
		return res.status(HttpStatus.OK).json(foundUser);
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
		const responseLogin = await this.usersService.logIn(data, res);
		return res.status(responseLogin.statusCode).json(responseLogin);
	}


	@ApiOperation({ summary: 'my_profile' })
	@ApiOkResponse({ description: '성공', type: 'application/json' })
	@UseGuards(UserAuthGuard)
	@Put('my_profile')
	async updateMyProfile(
		@Req() req: Request,
		@Body() data: UpdateUserRequestDto,
		@Res() res: Response,
	){
		const foundUser = req.user as UsersEntity;
		if (!foundUser) {
			throw new NotFoundException('해당 유저가 존재하지 않습니다.');
		}
		Object.assign(foundUser, data);
		const responseUpdatedUser = await this.usersService.updateUser(foundUser);
		return res.status(responseUpdatedUser.statusCode).json(responseUpdatedUser);
	}

	@ApiOperation({ summary: 'my_boards' })
	@ApiOkResponse({ description: '성공', type: 'application/json' })
	@UseGuards(UserAuthGuard)
	@Get('my_boards')
	async findMyBoards(@Req() req: Request) {
		const foundUser = req.user as UsersEntity;
		return this.usersService.findMyBoardsByEmail(foundUser.email);
	}

	@ApiOperation({ summary: 'kakao_login' })
	@ApiOkResponse({ description: '성공', type: 'application/json' })
	@Get('/kakao/callback')
	async kakaoCallback(@Req() req, @Res() res: Response) {
		const data: { foundUser: any; userData: any } = await this.usersService.checkRegister(LoginType.KAKAO, req.headers['access-token']);
		console.log('data:',data);
		let userData = data.foundUser;
		if (!userData) {
			const result = await this.usersService.socialSignUp(data.userData);
			userData = result.data;
		}
		const accessToken = await this.usersService.createToken(userData.email);

		res.cookie('accessToken', accessToken, {
			domain: 'localhost',
			expires: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
			httpOnly: true,
			secure: true,
		});

		return res.status(HttpStatus.OK).json({
			ok: true,
			statusCode: HttpStatus.OK,
			message: 'SUCCESS',
			data: userData,
		});
	}

	@ApiOperation({ summary: 'google_login' })
	@ApiOkResponse({ description: '성공', type: 'application/json' })
	@UseGuards(GoogleGuard)
	@Get('google')
	async googleLogin(@Req() req, @Res() res: Response) {
		// console.log('req:',req);
	}


	@ApiOperation({ summary: 'google_login_callback' })
	@ApiOkResponse({ description: '성공', type: 'application/json' })
	@UseGuards(GoogleGuard)
	@Get('/google/callback')
	async googleCallback(@Req() req, @Res() res: Response) {
		const responseGoogleUser =  await this.usersService.googleLogin(req.user);
		return res.status(responseGoogleUser.statusCode).json(responseGoogleUser);
	}

	@ApiOperation({ summary: 'naver_login' })
	@ApiOkResponse({ description: '성공', type: 'application/json' })
	@UseGuards(NaverGuard)
	@Get('google')
	async naverLogin(@Req() req, @Res() res: Response) {}

	@ApiOperation({ summary: 'naver_login_callback' })
	@ApiOkResponse({ description: '성공', type: 'application/json' })
	@UseGuards(GoogleGuard)
	@Get('/naver/callback')
	async naverCallback(@Req() req, @Res() res: Response) {

	}
}
