import { CoreEntity } from './CoreEntity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { UsersEntity } from './UsersEntity';

@Entity({schema:'nest_watcha',name: 'user_auth'})
export class UserAuthEntity extends CoreEntity{
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
}