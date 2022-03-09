import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../../database/service/auth.service';
import { UsersService } from '../../database/service/users.service';

@ApiTags('AUTH')
@Controller('auth')
export class AuthController{
  constructor(
    private readonly authService:AuthService,
    private readonly userService:UsersService,
  ) {}

  // @Get('/kakao/callback')
  // async kakaoCallback(@Query() query: any, @Request() req: any, @Res() res: Response) {
  //   const data = await this.authService.checkRegister(query, LoginType.KAKAO, req.headers.origin);
  //   let userId = data.user_auth?.user?.id;
  //   if (!data.user_auth) {
  //     const reuslt = await this.createUser(data.login_result, LoginType.KAKAO);
  //     const result = await this.userService.kakaoSignUp(data.login_result);
  //     userId = reuslt.data.user.id;
  //   }
  //   const user = await this.userService.findUserProfile(userId);
  //   return this.createToken(user, req.headers.origin, res);
  // }
}