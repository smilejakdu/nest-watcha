import { UserEntity } from '@root/models/tables/user.entity';

export type FoundUserType = Pick<UserEntity, 'id' | 'username' | 'email' | 'phone'>

export type GoogleUserData = Pick<UserEntity, 'id'| 'email' | 'firstName', 'lastName'>;

export type KakaoUserData = Pick<UserEntity, 'id' | 'email' | 'username'>;

export type NaverUserData = Pick<UserEntity, 'id' | 'email' | 'username'>;