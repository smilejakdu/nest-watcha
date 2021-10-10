import { Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service';

@Injectable()
export class AppService {
	constructor(private usersService: UsersService) {}
	async getHello() {
		return process.env.SECRET;
	}
}
