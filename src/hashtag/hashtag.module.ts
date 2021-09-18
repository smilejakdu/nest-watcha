import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Boards } from 'src/entities/Boards';
import { Users } from 'src/entities/Users';
import { HashTag } from '../entities/HashTag';
import { HashtagController } from './hashtag.controller';
import { HashtagService } from './hashtag.service';
``

@Module({
  imports: [TypeOrmModule.forFeature([HashTag , Boards, Users])],
  providers:[HashtagService],
  controllers:[HashtagController]
})
export class HashtagModule {}
