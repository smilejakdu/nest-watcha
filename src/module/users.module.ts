import { Module } from '@nestjs/common';
import { UsersService } from '../database/service/users.service';
import { UsersController } from '../controller/users/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/database/entities/UsersEntity';

@Module({
	imports: [TypeOrmModule.forFeature([UsersEntity])],
	providers: [UsersService],
	exports: [UsersService],
	controllers: [UsersController],
})
export class UsersModule {}
