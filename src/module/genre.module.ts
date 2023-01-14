import {Module} from '@nestjs/common';
import { GenreService } from '../service/genre.service';
import { GenreController } from '../controller/genre/genre.controller';
import { GenreRepository } from '../database/repository/MovieAndGenreRepository/genre.repository';
import {TypeOrmExModule} from "../shared/typeorm-ex.module";

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([GenreRepository]),
  ],
  providers: [GenreService],
  exports: [GenreService],
  controllers: [GenreController],
})
export class GenreModule {}
