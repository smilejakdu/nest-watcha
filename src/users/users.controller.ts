import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { SignUpRequestDto } from './dto/signup.request.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(private usersService: UsersService) {}
	@Get()
	getUsers(@Req() req) {
		return req.user;
	}

	@Post()
	signUp(@Body() data: SignUpRequestDto) {
		this.usersService.signUp(data.nickname, data.password);
	}

	@Post('login')
	login() {}

	@Post('logout')
	logOut(@Req() req, @Res() res) {
		req.logout();
		res.send('ok');
	}
}
