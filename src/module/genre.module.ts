import { CacheModule, Module } from '@nestjs/common';
import { GenreService } from '../service/genre.service';
import { GenreController } from '../controller/genre/genre.controller';
import { GenreRepository } from '../database/repository/MovieAndGenreRepository/genre.repository';
import { TypeOrmExModule } from "../shared/typeorm/typeorm-ex.module";
import {ConfigService} from "@nestjs/config";
import {BullModule} from "@nestjs/bull";

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
        GenreRepository
    ]),
    CacheModule.registerAsync({
        useFactory: (configService: ConfigService) => ({
            isGlobal: true,
            host: configService.get<string>('REDIS_HOST'),
            port: configService.get<number>('REDIS_PORT'),
            password: configService.get<string>('REDIS_PASSWORD'),
            ttl: configService.get<number>('CACHE_TTL'),
            max: configService.get<number>('CACHE_MAX'),
        }),
        inject: [ConfigService],
    }),
      BullModule.forRootAsync({
          useFactory: (configService: ConfigService) => ({
              redis: {
                  host: configService.get<string>('REDIS_HOST'),
                  port: configService.get<number>('REDIS_PORT'),
                  password: configService.get<string>('REDIS_PASSWORD'),
              },
          }),
          inject: [ConfigService],
      }),
  ],
  providers: [GenreService],
  exports: [GenreService],
  controllers: [GenreController],
})
export class GenreModule {}
