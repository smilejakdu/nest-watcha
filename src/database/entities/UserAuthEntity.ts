import { CoreEntity } from './CoreEntity';
import { Column, Entity, JoinColumn, OneToOne, QueryRunner } from 'typeorm';
import { UsersEntity } from './UsersEntity';

export enum LoginType {
  NAVER = 'naver',
  KAKAO = 'kakao',
  GOOGLE = 'google',
}

@Entity({schema:'nest_watcha',name: 'user_auth'})
export class UserAuthEntity extends CoreEntity{
  static loginTypeSelectList = ['user_auth.emailAuthId', 'user_auth.naverAuthId', 'user_auth.kakaoAuthId', 'user_auth.appleAuthId'];

  @Column('int', { name: 'userId', nullable: true })
  userId: number | null;

  @OneToOne(
    () => UsersEntity,
    user => user.id,
    {nullable: false},
  )
  @JoinColumn()
  user: UsersEntity;

  @Column({
    unique: true,
    nullable: true,
  })
  naverAuthId: string;

  @Column({
    unique: true,
    nullable: true,
  })
  kakaoAuthId: string;

  @Column({
    unique: true,
    nullable: true,
  })
  googleAuthId: string;

  static makeQueryBuilder(queryRunner?: QueryRunner) {
    if (queryRunner) {
      return queryRunner.manager.createQueryBuilder(UserAuthEntity, 'user_auth');
    } else {
      return this.createQueryBuilder('user_auth');
    }
  }

  static findLoginId(id, queryRunner?: QueryRunner) {
    const user_auth = this.makeQueryBuilder(queryRunner)
      .innerJoinAndSelect('user_auth.user', 'user')
      .select(['user.id', 'user.status', 'user_auth.id'])
      .where('user_auth.naver_auth_id=:id OR user_auth.kakao_auth_id=:id OR user_auth.google_auth_id=:id', {id: id});

    return user_auth;
  }

  static findAuthId(id, type, queryRunner?: QueryRunner) {
    let user_auth = this.makeQueryBuilder(queryRunner)
      .innerJoinAndSelect('user_auth.user', 'user')
      .select(['user.id', 'user.status', 'user_auth.id']);

    if (type == LoginType.NAVER) {
      user_auth = user_auth.where('user_auth.naver_auth_id = :id', {id});
    } else if (type == LoginType.KAKAO) {
      user_auth = user_auth.where('user_auth.kakao_auth_id = :id', {id});
    } else if (type == LoginType.GOOGLE) {
      user_auth = user_auth.where('user_auth.google_auth_id = :id', {id});
    } else {
      return null;
    }

    return user_auth;
  }

  static removeUserAuth(id: number, queryRunner?: QueryRunner) {
    return this.makeQueryBuilder(queryRunner)
      .softDelete()
      .from(UserAuthEntity)
      .where('user_auth.id = :id ', {id})
      .execute();
  }
}