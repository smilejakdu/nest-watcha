import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';

import * as Jwt from 'jsonwebtoken';
import { UsersEntity } from '../../../database/entities/users.entity';

@Injectable()
export class UserAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    let accessToken = req.headers['access_token'];

    if (!accessToken || accessToken === 'null') {
      accessToken = req.cookies.accessToken;
    }

    let userEmail: any;

    try {
      const decodedUserJwt: any = Jwt.verify(accessToken, process.env.JWT);
      userEmail = decodedUserJwt?.sub?.email;
    } catch (jwtErr) {
      res.cookie('accessToken', null, {
        domain: process.env['DB_HOST'],
        expires: new Date(new Date().getTime() - 1),
        httpOnly: true,
        secure: true,
      });
      throw new HttpException('로그인 정보가 만료되었습니다.01', HttpStatus.UNAUTHORIZED);
    }
    if (!userEmail) {
      res.cookie('accessToken', null, {
        domain: process.env['DB_HOST'],
        expires: new Date(new Date().getTime() - 1),
        httpOnly: true,
        secure: true,
      });
      throw new HttpException('로그인 정보가 만료되었습니다.02', HttpStatus.UNAUTHORIZED);
    }

    const userData = await UsersEntity.findOne({email:userEmail});
    if (!userData) {
      res.cookie('accessToken', null, {
        domain: process.env['DB_HOST'],
        expires: new Date(new Date().getTime() - 1),
        httpOnly: true,
        secure: true,
      });
      throw new HttpException('does not found users.', HttpStatus.UNAUTHORIZED);
    }
    req.user = userData;

    return true;
  }
}

@Injectable()
export class UserAuthGuardOptional implements CanActivate {

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    let accessToken = req.headers['access_token'];

    if (!accessToken || accessToken === 'null') {
      accessToken = req.cookies.accessToken;
    }

    const cookieDomain = process.env.STAGE === 'local' ? 'localhost' : '.domain.co.kr';

    let user: any;

    try {
      const decodedUserJwt: any = Jwt.verify(accessToken, process.env.JWT);
      user = decodedUserJwt.sub;
    } catch (jwtErr) {
      res.cookie('accessToken', null, {
        domain: cookieDomain,
        expires: new Date(new Date().getTime() - 1),
        sameSite: process.env.STAGE === 'dev' ? 'None' : 'Lax',
        httpOnly: true,
        secure: true,
      });
    }
    if (!user) {
      req.user = null;
      return true;
    }

    let userData = await UsersEntity.findOne(user.id);
    if (!userData) {
      res.cookie('accessToken', null, {
        domain: cookieDomain,
        expires: new Date(new Date().getTime() - 1),
        sameSite: process.env.STAGE === 'dev' ? 'None' : 'Lax',
        httpOnly: true,
        secure: true,
      });
      userData = null;
    }
    req.user = userData;

    return true;
  }
}
