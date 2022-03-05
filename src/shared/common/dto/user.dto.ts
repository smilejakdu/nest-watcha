import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
	@ApiProperty({
		required: true,
		example: 1,
		description: '아이디',
	})
	id: number;
}
