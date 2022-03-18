import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignUpRequestDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		example: 'ash',
		description: 'username',
	})
	public username: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		example: 'ash@gmail.com',
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

	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		example: 'phonenumber',
		description: 'phone',
	})
	public phone: string;

	@IsString()
	@ApiProperty({
		example: 'kakao_auth_id',
		description: 'kakao_auth_id',
	})
	public kakao_auth_id?: string;

	@IsString()
	@ApiProperty({
		example: 'naver_auth_id',
		description: 'naver_auth_id',
	})
	public naver_auth_id?: string;

	@IsString()
	@ApiProperty({
		example: 'google_auth_id',
		description: 'google_auth_id',
	})
	public google_auth_id?: string;
}
