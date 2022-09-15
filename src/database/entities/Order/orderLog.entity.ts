import { CoreEntity } from '../core.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { JsonTransformer } from '../../transformer';
import { UsersEntity } from '../User/users.entity';
import { MovieEntity } from '../MovieAndGenre/movie.entity';

@Entity({ schema: 'nest_watcha', name: 'order_log' })
export class OrderLogEntity extends CoreEntity {
  @Column({
    type: 'text',
    transformer: JsonTransformer,
    nullable: true,
  })
  orderData: Record<string, any>;

  @Column('int', { name: 'userId', nullable: true })
  userId: number|null;

  @Column('int', { name: 'movieId', nullable: true })
  movieId: number|null;

  @ManyToOne(() => UsersEntity,
    users => users.OrderLog, {
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  User: UsersEntity;

  @ManyToOne(() => MovieEntity,
    movies => movies.OrderLog, {
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    })
  @JoinColumn([{ name: 'movieId', referencedColumnName: 'id' }])
  Movie: MovieEntity;
}