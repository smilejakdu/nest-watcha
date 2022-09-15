import 'reflect-metadata';
import { DataSource } from 'typeorm';
dotenv.config();
import dotenv from 'dotenv';
import { UsersEntity } from './database/entities/User/users.entity';
import { HashTagEntity } from './database/entities/hashTag.entity';
import { CoreEntity } from './database/entities/core.entity';
import { CommentsEntity } from './database/entities/comments.entity';
import { BoardImageEntity } from './database/entities/Board/BoardImage.entity';
import { BoardHashTagEntity } from './database/entities/Board/BoardHashTag.entity';
import { MovieEntity } from './database/entities/MovieAndGenre/movie.entity';
import { GenreEntity } from './database/entities/MovieAndGenre/genre.entity';
import { GenreMovieEntity } from './database/entities/MovieAndGenre/genreMovie.entity';
import { subMovieImageEntity } from './database/entities/MovieAndGenre/subMovieImage.entity';
import { OrderEntity } from './database/entities/Order/order.entity';
import { OrderLogEntity } from './database/entities/Order/orderLog.entity';
import { OrderClaimEntity } from './database/entities/Order/orderClaim.entity';
import { MovieOptionEntity } from './database/entities/MovieAndGenre/movieOption.entity';
import { PermissionEntity } from './database/entities/User/permission.entity';


export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: Number(process.env.MYSQL_PORT) as number,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: [
    UsersEntity,
    HashTagEntity,
    CoreEntity,
    CommentsEntity,
    BoardImageEntity,
    BoardHashTagEntity,
    MovieEntity,
    GenreEntity,
    GenreMovieEntity,
    subMovieImageEntity,
    MovieEntity ,
    OrderEntity,
    OrderLogEntity,
    OrderClaimEntity,
    MovieOptionEntity,
    PermissionEntity,
  ],
  charset: 'utf8mb4',
  synchronize: true, // 한번 만들고 나서는 false 로 해야함
  logging: true, // typescript 작성하게 될때 orm 이 자동으로 sql 로 바꿔주게된다. 이게 비효율적으로 될 수도 있다. 그래서
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });