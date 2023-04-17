import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {IsEmail, IsNotEmpty, IsOptional, IsString} from 'class-validator';
import {IsNotEmptyString} from "../../../../decorators/is-not-empty-string.decorator";

export class SignUpRequestDto {
	@IsNotEmptyString(
		1,
		100,
		"username",
		"username",
	)
	username: string;

	@IsEmail()
	@IsNotEmptyString(
		1,
		100,
		"ash@gmail.com",
		"email",
	)
	email: string;

	@IsNotEmptyString(
		1,
		100,
		"123123123",
		"password",
	)
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
