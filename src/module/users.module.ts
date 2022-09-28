import { Module } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { UsersController } from '../controller/users/users.controller';
import { UserRepository } from '../database/repository/user.repository';
import { TypeOrmExModule } from 'src/shared/typeorm-ex.module';

@Module({
	imports: [
		TypeOrmExModule.forCustomRepository([
			UserRepository,
		]),
	],
	providers: [UsersService],
	controllers: [UsersController],
	exports: [UsersService],
})
export class UsersModule {}
