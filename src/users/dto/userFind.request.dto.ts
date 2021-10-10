import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CoreEntity } from 'src/entities/CoreEntity';

export class UserFindRequestDto extends CoreEntity {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		example: 'ash',
		description: '닉네임',
	})
	public nickname: string;
}
