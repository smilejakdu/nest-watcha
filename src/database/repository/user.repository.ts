import { EntityRepository, QueryRunner, Repository, SelectQueryBuilder } from 'typeorm';
import { LoginType, UsersEntity } from '../entities/UsersEntity';
import { CoreResponse } from '../../shared/CoreResponse';
import { HttpStatus } from '@nestjs/common';
import { UserFindOneOptions } from '../service/users.service';
import { SignUpRequestDto } from '../../controller/users/users.controller.dto/signUpDto/signUp.request.dto';
import bcrypt from 'bcrypt';
import { transactionRunner } from '../../shared/common/transaction/transaction';
import { LoginRequestDto } from '../../controller/users/users.controller.dto/logInDto/logIn.request.dto';
import * as Jwt from 'jsonwebtoken';
import { isNil } from 'lodash';

@EntityRepository(UsersEntity)
export class UserRepository extends Repository<UsersEntity>{
  makeQueryBuilder(queryRunner?: QueryRunner): SelectQueryBuilder<UsersEntity> {
    return this.createQueryBuilder('users', queryRunner);
  }

  async findById(id:number) : Promise<CoreResponse>{
    const foundUser = await this.makeQueryBuilder()
      .where('users.id=:id ', {id})
      .andWhere('users.deletedAt is NULL');

    if (isNil(foundUser)){
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
      data:foundUser,
    };
  }

  async findByUsername(data : UserFindOneOptions):Promise<CoreResponse>{
    const {id , username} =data;
    const foundUser = await this.makeQueryBuilder()
      .leftJoinAndSelect('users.Board','boards');
    if(id) foundUser.andWhere('users.id=:id',{id:id});
    if(username) foundUser.andWhere('users.username=:username',{username:username});
    foundUser.andWhere('users.deletedAt is NULL');

    if (isNil(foundUser)){
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
      data:foundUser.getOne(),
    };
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

  async signUp(signUpDto :SignUpRequestDto):Promise<CoreResponse>{
    const {password , username ,email , phone}= signUpDto;
    const hashedPassword = await bcrypt.hash(password, 12);

    const foundUser = await this.findByUsername({username:username});
    if (foundUser) {
      return {
        ok:false,
        statusCode:HttpStatus.BAD_REQUEST,
        message:'EXIST_USER'
      };
    }
    
    const createUser = await transactionRunner(async (queryRunner) => {
      return await this.makeQueryBuilder()
        .insert()
        .values({
          username:username,
          password:hashedPassword,
        })
        .execute();
      });
    delete createUser.password;

    return {
      ok:true,
      statusCode : HttpStatus.CREATED,
      message:'SUCCESS',
      data:createUser,
    };
  }

  async logIn(logInDto:LoginRequestDto):Promise<CoreResponse>{
    const {username,password}= logInDto;
    const foundUser = await this.makeQueryBuilder()
      .where('users.username =:username',{username:username})
      .getOne();

    if (isNil(foundUser)) {
      return{
        ok:false,
        statusCode:HttpStatus.BAD_REQUEST,
        message:'해당하는 유저를 찾을 수 없습니다.'
      };
    }
    const result = await bcrypt.compare(password, foundUser.password);
    const payload = {username: foundUser.username};
    const jwt = await Jwt.sign(payload, process.env.JWT, {expiresIn: '30d'});

    if (result) {
      delete foundUser.password;
      return {
        ok:true,
        statusCode:HttpStatus.OK,
        message:'SUCCESS',
        data:{
          user : foundUser,
          jwt : jwt
        }
      };
    }
    return {
      ok:false,
      statusCode:HttpStatus.BAD_REQUEST,
      message:'username 과 password 를 확인하세요'
    };
  }

  async kakaoSignUp(){

  }
}