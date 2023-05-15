import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../service/users.service';


describe('user Controller', () => {
	const host = 'http://localhost:13014';
	let app: INestApplication;
	let testingModule: TestingModule;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [UsersService],
		}).compile();

		app = testingModule.createNestApplication();
		await (await app.init()).listen(13014);
	});
});
