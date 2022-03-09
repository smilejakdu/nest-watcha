import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { getConnection } from 'typeorm';

import * as Jwt from 'jsonwebtoken';
import { UsersEntity } from '../../../database/entities/UsersEntity';

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    let accessToken = req.headers['access-token'];

    if (!accessToken || accessToken === 'null') {
      accessToken = req.cookies.accessToken;
      console.log('cookies access-token', accessToken);
    }

    const cookieDomain = process.env.DB_HOST === 'local' ? 'localhost' : '.socialclub.co.kr';

    let user: any;

    try {
      const decodedUserJwt: any = Jwt.verify(accessToken, process.env.JWT_SECRET);
      user = decodedUserJwt.sub;
    } catch (jwtErr) {
      res.cookie('accessToken', null, {
        domain: cookieDomain,
        expires: new Date(new Date().getTime() - 1),
        sameSite: process.env.STAGE === 'dev' ? 'None' : 'Lax',
        httpOnly: true,
        secure: true,
      });
      throw new HttpException('로그인 정보가 만료되었습니다.01', HttpStatus.UNAUTHORIZED);
    }

    if (!user) {
      res.cookie('accessToken', null, {
        domain: cookieDomain,
        expires: new Date(new Date().getTime() - 1),
        sameSite: process.env.STAGE === 'dev' ? 'None' : 'Lax',
        httpOnly: true,
        secure: true,
      });
      throw new HttpException('로그인 정보가 만료되었습니다.02', HttpStatus.UNAUTHORIZED);
    }

    const conn = getConnection('user');

    const userData = await UsersEntity.findOne(user.id);
    if (!userData) {
      res.cookie('accessToken', null, {
        domain: cookieDomain,
        expires: new Date(new Date().getTime() - 1),
        sameSite: process.env.STAGE === 'dev' ? 'None' : 'Lax',
        httpOnly: true,
        secure: true,
      });
      throw new HttpException('찾을 수 없는 고객 데이터입니다.', HttpStatus.UNAUTHORIZED);
    }
    req.user = userData;

    return true;
  }
}

@Injectable()
export class UserAuthGuardOptional implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    let accessToken = req.headers['access-token'];

    if (!accessToken || accessToken === 'null') {
      accessToken = req.cookies.accessToken;
    }

    const cookieDomain = process.env.STAGE === 'local' ? 'localhost' : '.socialclub.co.kr';

    let user: any;

    try {
      const decodedUserJwt: any = Jwt.verify(accessToken, process.env.JWT_SECRET);
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

    const conn = getConnection('user');

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
