import {QueryRunner, Repository } from 'typeorm';
import { LoginType, UsersEntity } from '../entities/User/Users.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as Jwt from 'jsonwebtoken';
import axios from 'axios';
import {CustomRepository} from "../../shared/typeorm-ex.decorator";

@CustomRepository(UsersEntity)
export class UserRepository extends Repository<UsersEntity> {
  makeQueryBuilder(queryRunner?: QueryRunner) {
    return this.createQueryBuilder('users', queryRunner);
  }

  findUserById(id:number) {
    return this.makeQueryBuilder()
      .select([
        'users.id',
        'users.email',
        'users.username',
        'users.phone',
        'users.kakao_auth_id',
        'users.naver_auth_id',
        'users.google_auth_id',
      ])
      .leftJoin('users.Boards','boards')
      .leftJoin('users.Orders','orders')
      .where('users.id=:id',{id});
  }

  findMyBoardByEmail(email: string) {
    return this.makeQueryBuilder()
      .select([
        'users.username',
        'users.email',
      ])
      .addSelect([
        'boards.id',
        'boards.title',
        'boards.content',
        'boards.updatedAt',
      ])
      .addSelect([
        'boardImages.id',
        'boardImages.imagePath'
      ])
      .addSelect([
        'comments.id',
        'comments.content',
        'comments.updatedAt',
      ])
      .innerJoin('users.Boards','boards')
      .leftJoin('boards.boardImages','boardImages')
      .leftJoin('boards.comments','comments')
      .where('users.email =:email',{email:email})
      .getMany();
  }

  findAuthLoginId(id: number, queryRunner?: QueryRunner) {
    return this.makeQueryBuilder()
      .select(['users.id', 'users.username' , 'users.status'])
      .where('users.naver_auth_id=:id OR users.kakao_auth_id=:id OR users.google_auth_id=:id', {id: id});
  }

  getToken(email: string) {
    const payload = {sub: email};
    return Jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });
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
    return await this.makeQueryBuilder()
      .insert()
      .values({
        username:kakaoUser.properties.nickname,
        email:kakaoUser.kakao_account.email,
        kakao_auth_id:kakaoUser.id,
      })
      .execute();
  }

  removeUser(id: number, queryRunner?: QueryRunner) {
    return this.makeQueryBuilder()
      .softDelete()
      .where('users.id =: id',{id:id})
      .from(UsersEntity);
  }

  async kakaoCallback(tokenString: string): Promise<any> {
    const get_profile_url = 'https://kapi.kakao.com/v2/user/me';
    console.log('tokenString',tokenString);
    const getProfileHeaders = {
      Authorization: `Bearer ${tokenString}`,
    };

    let profileResponse;

    await axios.post(get_profile_url, {
      property_keys: [
        'properties.nickname',
        'kakao_account.email',
      ],
    } , {
      headers: getProfileHeaders,
    })
      .then(res=>{
      profileResponse = {res: res};
      console.log('profileResponse', profileResponse.res.data);
      }).catch(error=>{
      console.log('error', error.message);
        throw new HttpException('Kakao login error',HttpStatus.INTERNAL_SERVER_ERROR);
      });
    if (!profileResponse.res.data.id) {
      throw new HttpException('Kakao login error',
                                        HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return profileResponse.res.data;
  }
}