import {BoardHashTagEntity} from "./entities/Board/BoardHashTag.entity";
import {BoardImageEntity} from "./entities/Board/BoardImage.entity";
import {BoardsEntity} from "./entities/Board/Boards.entity";
import {GenreEntity} from "./entities/MovieAndGenre/genre.entity";
import {GenreMovieEntity} from "./entities/MovieAndGenre/genreMovie.entity";
import {MovieEntity} from "./entities/MovieAndGenre/movie.entity";
import {MovieOptionEntity} from "./entities/MovieAndGenre/movieOption.entity";
import {subMovieImageEntity} from "./entities/MovieAndGenre/subMovieImage.entity";
import {OrderEntity} from "./entities/Order/order.entity";
import {OrderClaimEntity} from "./entities/Order/orderClaim.entity";
import {OrderLogEntity} from "./entities/Order/orderLog.entity";
import {PurchaseEntity} from "./entities/Purchase/purchase.entity";
import {PurchaseVbankEntity} from "./entities/Purchase/purchase_vbank.entity";
import {PermissionEntity} from "./entities/User/Permission.entity";
import {UsersEntity} from "./entities/User/Users.entity";
import {CoreEntity} from "./entities/core.entity";
import {CommentsEntity} from "./entities/comments.entity";
import {HashTagEntity} from "./entities/hashTag.entity";
import {SchedulesEntity} from "./entities/schedules.entity";
import * as process from "process";

export const TypeOrmModuleAsyncOptions = {
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    port : process.env.MYSQL_PORT,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    entities: [
      BoardHashTagEntity,
      BoardImageEntity,
      BoardsEntity,
      GenreEntity,
      GenreMovieEntity,
      MovieEntity,
      MovieOptionEntity,
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
    ],
    autoLoadEntities: true,
    charset: "utf8mb4",
    synchronize: process.env.NODE_ENV === 'local' ? true : false,
    logging: process.env.NODE_ENV === 'local' ? true : false,
}