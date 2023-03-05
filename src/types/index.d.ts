import { UserEntity } from '@root/models/tables/user.entity';

export type FoundUserType = Pick<UserEntity, 'id' | 'username' | 'email' | 'phone'>
