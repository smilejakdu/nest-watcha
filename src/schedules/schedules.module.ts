import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Schedules } from '../entities/Schedules';

@Module({
	imports: [TypeOrmModule.forFeature([Users, Schedules])],
	providers: [SchedulesService],
	controllers: [SchedulesController],
})
export class SchedulesModule {}
