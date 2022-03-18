import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDto {
	@IsString()
	@ApiProperty({
		example: 'email',
		description: 'email',
	})
	public email: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		example: '123123123',
		description: '비밀번호',
	})
	public password: string;
}
