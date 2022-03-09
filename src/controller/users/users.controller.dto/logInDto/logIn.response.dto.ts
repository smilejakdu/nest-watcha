import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class LoginResponseDto {
	@IsBoolean()
	@ApiProperty({
		example: 'true',
		description: 'boolean',
	})
	public ok: boolean;

	@IsNumber()
	@ApiProperty({
		example: 200,
		description: 'statusCode',
	})
	public statusCode: number;

	@IsString()
	@ApiProperty({
		example: 'SUCCESS',
		description: 'message',
	})
	public message: string;

	@IsString()
	@ApiProperty({
		example: 'asdfkvcjbkajsdfh#werlkhaasdfkjbv;asdflhqwerasdflkjasdglh',
		description: 'Jwt',
	})
	public jwt: string;

	@ApiProperty({
		example: 'data',
		description: 'data',
	})
	public data: any;
}
