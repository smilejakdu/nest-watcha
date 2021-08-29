import { ApiProperty } from '@nestjs/swagger';
import { SignUpRequestDto } from 'src/users/dto/signup.request.dto';

export class UserDto extends SignUpRequestDto {
	@ApiProperty({
		required: true,
		example: 1,
		description: '아이디',
	})
	id: number;
}
