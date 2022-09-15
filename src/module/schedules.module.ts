import { Module } from '@nestjs/common';
import { SchedulesService } from '../service/schedules.service';
import { SchedulesController } from '../controller/schedules/schedules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/database/entities/User/users.entity';
import { SchedulesEntity } from '../database/entities/schedules.entity';

@Module({
	imports: [TypeOrmModule.forFeature([UsersEntity, SchedulesEntity])],
	providers: [SchedulesService],
	controllers: [SchedulesController],
})
export class SchedulesModule {}
