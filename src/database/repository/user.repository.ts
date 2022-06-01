import { EntityRepository, QueryRunner, Repository } from 'typeorm';
import { LoginType, UsersEntity } from '../entities/users.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { transactionRunner } from '../../shared/common/transaction/transaction';
import * as Jwt from 'jsonwebtoken';
import axios from 'axios';

@EntityRepository(UsersEntity)
export class UserRepository extends Repository<UsersEntity> {
  makeQueryBuilder(queryRunner?: QueryRunner) {
    return this.createQueryBuilder('users', queryRunner);
  }

  findOneUserById(id:number) {
    return this.makeQueryBuilder()
      .where('users.id=:id ', {id});
  }

  findMyBoard(email:string) {
    return this.makeQueryBuilder()
      .select([
        'boards.id',
        'boards.title',
        'boards.content',
        'boards.updatedAt',
      ])
      .addSelect([
        'users.username',
        'users.email',
      ])
      .addSelect([
        'images.id',
        'images.imagePath'
      ])
      .addSelect([
        'comments.id',
        'comments.content',
        'comments.updatedAt',
      ])
      .innerJoin('users.Boards','boards')
      .innerJoin('boards.Images','images')
      .leftJoin('boards.Comments','comments')
      .where('users.email =:email',{email});
  }

  findByEmail(email:string) {
    return this.makeQueryBuilder()
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
      .addSelect([
        'images.id',
        'images.imagePath'
      ])
      .leftJoin('users.Boards','boards')
      .innerJoin('boards.Images','images')
      .where('users.email=:email',{email:email});
    }

  findAuthLoginId(id:number, queryRunner?: QueryRunner) {
    return this.makeQueryBuilder()
      .select(['users.id', 'users.username' , 'users.status'])
      .where('users.naver_auth_id=:id OR users.kakao_auth_id=:id OR users.google_auth_id=:id', {id: id});
  }

  findUserById(id: number) {
    return this.makeQueryBuilder()
      .where('users.id = :id', { id })
      .addSelect(['users.kakao_auth_id', 'users.google_auth_id', 'users.naver_auth_id']);
  }

  getToken(user_auth: any) {
    const payload = {sub: user_auth};
    const jwt = Jwt.sign(payload, process.env.JWT, {expiresIn: '30d'});
    return jwt;
  }

  async findAuthId(id:string, type:LoginType) {
    let foundUserAuth = this.makeQueryBuilder();

    if (type === LoginType.NAVER) {
      foundUserAuth = foundUserAuth.where('users.naver_auth_id=:id', {id});
    } else if (type === LoginType.KAKAO) {
      foundUserAuth = foundUserAuth.where('users.kakao_auth_id=:id', {id});
    } else if (type === LoginType.GOOGLE) {
      foundUserAuth = foundUserAuth.where('users.google_auth_id=:id', {id});
    } else {
      return null;
    }
    return foundUserAuth.getOne();
  }

  async createKakaoUser(kakaoUser) {
    return await transactionRunner(async (queryRunner) => {
      return await this.makeQueryBuilder()
        .insert()
        .values({
          username:kakaoUser.properties.nickname,
          email:kakaoUser.kakao_account.email,
          kakao_auth_id:kakaoUser.id,
        })
        .execute();
    });
  }

  async createUser(user ,queryRunner?: QueryRunner) {
    const {password , ...newUser}= user;
    const hashedPassword = await bcrypt.hash(password, 12);

    const createUser = await transactionRunner(async (queryRunner) => {
      return await this.makeQueryBuilder()
        .insert()
        .values({
          username:newUser.username,
          password:hashedPassword,
          email:newUser.email,
          phone:newUser.phone ,
          kakao_auth_id:newUser.kakao_auth_id,
          naver_auth_id:newUser.naver_auth_id,
          google_auth_id:newUser.google_auth_id,
        })
        .execute();
      });
    delete createUser.password;
    return createUser.raw.insertId;
  }

  removeUser(id: number, queryRunner?: QueryRunner) {
    return this.findOneUserById(id)
      .softDelete()
      .from(UsersEntity);
  }

  async kakaoCallback(tokenString:string): Promise<any> {
    const get_profile_url = 'https://kapi.kakao.com/v2/user/me';

    const getProfileHeaders = {
      Authorization: `Bearer ${tokenString}`,
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
}