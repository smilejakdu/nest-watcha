import { Entity, ManyToOne, OneToMany} from 'typeorm';
import { CoreEntity } from './CoreEntity';
import { MovieEntity } from './MovieEntity';
import { UsersEntity } from './UsersEntity';

@Entity({schema:'nest_watcha',name:'carts'})
export class CartEntity extends CoreEntity {
  @OneToMany(
    () => MovieEntity,
    movieEntity => movieEntity.cart,
  )
  movie: MovieEntity[];

  @ManyToOne(
    ()=>UsersEntity,
    user => user.id
  )
  user : UsersEntity;
}