import { UndefinedToNullInterceptor } from '../../shared/common/interceptors/undefinedToNull.interceptor';
import {
	Body,
	Controller,
	Get, HttpStatus, NotFoundException,
	Param,
	ParseIntPipe,
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

	@ApiOperation({ summary: '회원검색 by id' })
	@ApiOkResponse({ description: '성공', type: 'application/json' })
	@Get(':id')
	async get(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
		const foundUser = await this.usersRepository.findOneBy({ id });
		if(!foundUser) {
			throw new NotFoundException('해당 유저가 존재하지 않습니다.');
		}
		return res.status(200).json(foundUser);
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

	@ApiOperation({ summary: 'my_profile' })
	@ApiOkResponse({ description: '성공', type: 'application/json' })
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

		const foundUser = await this.usersRepository.findOneBy({ id: userId });
		const accessToken = await this.usersService.createToken(foundUser.email);

		res.cookie('accessToken', accessToken, {
			domain: 'localhost',
			expires: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
			httpOnly: true,
			secure: true,
		});
		return res.status(HttpStatus.OK).json(foundUser);
	}
}
