import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/entities/UsersEntity';
import { SchedulesEntity } from '../entities/SchedulesEntity';

@Module({
	imports: [TypeOrmModule.forFeature([UsersEntity, SchedulesEntity])],
	providers: [SchedulesService],
	controllers: [SchedulesController],
})
export class SchedulesModule {}
