import { EntityRepository, QueryRunner, Repository } from 'typeorm';
import { LoginType, UsersEntity } from '../entities/users.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { transactionRunner } from '../../shared/common/transaction/transaction';
import axios from 'axios';

@EntityRepository(UsersEntity)
export class UserRepository extends Repository<UsersEntity> {
  makeQueryBuilder(queryRunner?: QueryRunner) {
    return this.createQueryBuilder('users', queryRunner);
  }

  findOneUserById(id:number) {
    return this.findAllUser()
      .where('users.id=:id ', {id});
  }

  findAllUser(){
    return this.makeQueryBuilder()
      .where('users.deletedAt is null');
  }

  findByUsername(username:string) {
    return this.findAllUser()
      .select([
        'users.id',
        'users.email',
        'users.password',
        'users.username',
        'users.kakao_auth_id',
        'users.naver_auth_id',
        'users.google_auth_id',
      ])
      .addSelect([
        'boards.id',
        'boards.title',
        'boards.content',
      ])
      .leftJoin('users.Boards','boards')
      .where('users.username=:username',{username});
    }

  findAuthLoginId(id:number, queryRunner?: QueryRunner) {
    return this.findAllUser()
      .select(['users.id', 'users.username' , 'users.status'])
      .where('users.naver_auth_id=:id OR users.kakao_auth_id=:id OR users.google_auth_id=:id', {id: id});
  }

  async findAuthId(id, type, queryRunner?: QueryRunner) {
    let foundUserAuth = this.makeQueryBuilder(queryRunner)
      .select(['users.id', 'users.status','users.username']);
    if (type == LoginType.NAVER) {
      foundUserAuth = foundUserAuth.where('users.naver_auth_id = :id', {id});
    } else if (type == LoginType.KAKAO) {
      foundUserAuth = foundUserAuth.where('users.kakao_auth_id = :id', {id});
    } else if (type == LoginType.GOOGLE) {
      foundUserAuth = foundUserAuth.where('users.google_auth_id = :id', {id});
    } else {
      return null;
    }
    return foundUserAuth.getOne();
  }

  async createUser(foundUser ,queryRunner?: QueryRunner) {
    const {password , ...newUser}= foundUser;
    const hashedPassword = await bcrypt.hash(password, 12);

    const createUser = await transactionRunner(async (queryRunner) => {
      return await this.makeQueryBuilder()
        .insert()
        .values({
          username:newUser.username,
          password:hashedPassword,
        })
        .execute();
      });
    delete createUser.password;
    return createUser;
  }

  removeUser(id: number, queryRunner?: QueryRunner) {
    return this.findOneUserById(id)
      .softDelete()
      .from(UsersEntity);
  }

  async kakaoCallback(query: any, redirectURI: string): Promise<any> {
    const client_id = process.env.AUTH_KAKAO_CLIENT_ID;
    const url = 'https://kauth.kakao.com/oauth/token';
    if (!query.code) {
      throw new HttpException('올바르지 않은 로그인 url입니다.', 400);
    }
    const data = {
      grant_type: 'authorization_code',
      client_id: client_id,
      redirect_uri: redirectURI,
      code: query.code,
    };
    let responseToken;
    await axios.post(url, data , {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    }).then(res=> {
      console.log(res);
      responseToken = {res:res};
    })
    .catch(error=> {
      console.log(error);
    });

    const get_profile_url = 'https://kapi.kakao.com/v2/user/me';

    const getProfileHeaders = {
      // Authorization: `Bearer ${token_res.data.access_token}`,
      Authorization: `Bearer ${responseToken.res.data.access_token}`,
    };

    let profileResponse;

    await axios.post(get_profile_url, null , {
      headers: getProfileHeaders,
    }).then(res=>{
      profileResponse = {res:res};
        console.log(res);
      }).catch(error=>{
        console.log(error);
      });
    if (!profileResponse.res.data.id) {
      throw new HttpException('Kakao login error',
                                        HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return profileResponse.res.data;
  }

  async checkRegister(query, type, origin) {
    let user_auth;
    let login_result;

    if (type == LoginType.KAKAO) {
      login_result = await this.kakaoCallback(query, `${origin}/auth/kakao/callback`);
      user_auth = this.findAuthId(login_result.id,LoginType.KAKAO);
    }

    return {
      user_auth: user_auth,
      login_result: login_result
    };
  }
}