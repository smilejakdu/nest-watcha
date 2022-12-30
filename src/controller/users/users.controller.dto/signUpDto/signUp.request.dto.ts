import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SignUpRequestDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		example: 'ash',
		description: 'username',
	})
	username: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		example: 'ash@gmail.com',
		description: 'email',
	})
	email: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		example: '123123123',
		description: '비밀번호',
	})
	password: string;

	@ApiProperty({
		example: '01012341234',
		description: 'phone',
	})
	@IsNotEmpty()
	phone: string;

	@ApiPropertyOptional({
		example: 'kakao_auth_id',
		description: 'kakao_auth_id',
	})
	@IsOptional()
	kakao_auth_id?: string;

	@ApiPropertyOptional({
		example: 'naver_auth_id',
		description: 'naver_auth_id',
	})
	@IsOptional()
	naver_auth_id?: string;

	@ApiPropertyOptional({
		example: 'google_auth_id',
		description: 'google_auth_id',
	})
	@IsOptional()
	google_auth_id?: string;
}
