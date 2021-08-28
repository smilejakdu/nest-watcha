import { Module } from '@nestjs/common';
import dotenv from 'dotenv';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';

dotenv.config();
@Module({
	imports: [TypeOrmModule.forFeature([Users])],
	providers: [UsersService],
	exports: [UsersService],
	controllers: [UsersController],
})
export class UsersModule {}
