import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDto {
	@IsString()
	@ApiProperty({
		example: 'ash',
		description: '닉네임',
	})
	public nickname!: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		example: '123123123',
		description: '비밀번호',
	})
	public password!: string;
}
