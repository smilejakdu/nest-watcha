import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {BoardsEntity} from "../../database/entities/Board/Boards.entity";
import {GenreEntity} from "../../database/entities/MovieAndGenre/genre.entity";
import {GenreMovieEntity} from "../../database/entities/MovieAndGenre/genreMovie.entity";
import {MovieEntity} from "../../database/entities/MovieAndGenre/movie.entity";
import {subMovieImageEntity} from "../../database/entities/MovieAndGenre/subMovieImage.entity";
import {OrderEntity} from "../../database/entities/Order/order.entity";
import {OrderClaimEntity} from "../../database/entities/Order/orderClaim.entity";
import {OrderLogEntity} from "../../database/entities/Order/orderLog.entity";
import {PurchaseEntity} from "../../database/entities/Purchase/purchase.entity";
import {PurchaseVbankEntity} from "../../database/entities/Purchase/purchase_vbank.entity";
import {PermissionEntity} from "../../database/entities/User/Permission.entity";
import {UsersEntity} from "../../database/entities/User/Users.entity";
import {CoreEntity} from "../../database/entities/core.entity";
import {CommentsEntity} from "../../database/entities/comments/comments.entity";
import {HashTagEntity} from "../../database/entities/hashTag.entity";
import {SchedulesEntity} from "../../database/entities/schedules.entity";
import {ReplyEntitiy} from "../../database/entities/comments/reply.entitiy";
import {MovieReviewEntitiy} from "../../database/entities/movieReview/movieReview.entitiy";
import {BoardHashTagEntity} from "../../database/entities/Board/BoardHashTag.entity";
import {BoardImageEntity} from "../../database/entities/Board/BoardImage.entity";

export const entities = [
  BoardHashTagEntity,
  BoardImageEntity,
  BoardsEntity,
  GenreEntity,
  GenreMovieEntity,
  MovieEntity,
  subMovieImageEntity,
  OrderEntity,
  OrderClaimEntity,
  OrderLogEntity,
  PurchaseEntity,
  PurchaseVbankEntity,
  PermissionEntity,
  UsersEntity,
  CoreEntity,
  CommentsEntity,
  HashTagEntity,
  SchedulesEntity,
  ReplyEntitiy,
  MovieReviewEntitiy,
];

export const typeormModule: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: [...entities],
  autoLoadEntities: true,
  charset: "utf8mb4",
  synchronize: true,
  logging: process.env.NODE_ENV === 'local',
  keepConnectionAlive: true,
};
