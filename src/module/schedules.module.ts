import { Module } from '@nestjs/common';
import { SchedulesService } from '../database/service/schedules.service';
import { SchedulesController } from '../controller/schedules/schedules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/database/entities/UsersEntity';
import { SchedulesEntity } from '../database/entities/SchedulesEntity';

@Module({
	imports: [TypeOrmModule.forFeature([UsersEntity, SchedulesEntity])],
	providers: [SchedulesService],
	controllers: [SchedulesController],
})
export class SchedulesModule {}
