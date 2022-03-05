import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginResponseDto {
	@IsString()
	@ApiProperty({
		example: 'ash',
		description: 'nickname',
	})
	public nickname: string;

	@IsString()
	@ApiProperty({
		example: 'asdfkvcjbkajsdfh#werlkhaasdfkjbv;asdflhqwerasdflkjasdglh',
		description: 'Jwt',
	})
	public jwt: string;

	@IsString()
	@ApiProperty({
		example: '2021-10-24 12:44:22',
		description: 'createdAt',
	})
	public createdAt: string;

	@IsString()
	@ApiProperty({
		example: '2021-10-24 14:44:22',
		description: 'updatedAt',
	})
	public updatedAt: string;
}
