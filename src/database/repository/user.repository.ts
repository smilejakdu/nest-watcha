import { EntityRepository, QueryRunner, Repository } from 'typeorm';
import { LoginType, UsersEntity } from '../entities/UsersEntity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserFindOneOptions } from '../service/users.service';
import bcrypt from 'bcrypt';
import { transactionRunner } from '../../shared/common/transaction/transaction';
import { isNil } from 'lodash';
import axios from 'axios';

@EntityRepository(UsersEntity)
export class UserRepository extends Repository<UsersEntity>{
  makeQueryBuilder(queryRunner?: QueryRunner) {
    return this.createQueryBuilder('users', queryRunner);
  }

  async findById(id:number) {
    const foundUser = await this.makeQueryBuilder()
      .where('users.id=:id ', {id})
      .andWhere('users.deletedAt is NULL');
    return foundUser;
  }

  async findByUsername(data : UserFindOneOptions){
    const {id , username} =data;
    const foundUser = await this.makeQueryBuilder()
      .leftJoinAndSelect('users.Board','boards');
    if(id) foundUser.andWhere('users.id=:id',{id:id});
    if(username) foundUser.andWhere('users.username=:username',{username:username});
    foundUser.andWhere('users.deletedAt is NULL');
    return foundUser.getOne();
    }

  async findAuthLoginId(id:number, queryRunner?: QueryRunner) {
    const foundUserAuthId = this.makeQueryBuilder(queryRunner)
      .select(['users.id', 'users.username' , 'users.status'])
      .where('users.naver_auth_id=:id OR users.kakao_auth_id=:id OR users.google_auth_id=:id', {id: id});

    if (isNil(foundUserAuthId)){
      return {
        ok : false,
        statusCode : HttpStatus.NOT_FOUND,
        message: 'NOT_FOUND_USER',
      };
    }

    return{
      ok : true,
      statusCode : HttpStatus.OK,
      message: 'SUCCESS',
      data:foundUserAuthId,
    };
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
      return {
        ok : false,
        statusCode : HttpStatus.NOT_FOUND,
        message: 'NOT_FOUND_USER',
      };
    }

    return {
      ok : true,
      statusCode : HttpStatus.OK,
      message: 'SUCCESS',
      data:foundUserAuth,
    };
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
  // async kakaoSignUp(){
  //
  // }

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
    const token_res = await axios.post(url, data , {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });

    const get_profile_url = 'https://kapi.kakao.com/v2/user/me';

    const getProfileHeaders = {
      Authorization: `Bearer ${token_res.data.access_token}`,
    };

    const profile_res = await axios.post(get_profile_url, null , {
      headers: getProfileHeaders,
    }).then(res=>{
        console.log(res);
      }).catch(error=>{
        console.log(error);
      });

    if (!profile_res.data.id) {
      throw new HttpException('Kakao login error',
                                        HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return profile_res.data;
  }
}