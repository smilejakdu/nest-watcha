import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CoreEntity } from 'src/database/entities/core.entity';

export class UserFindRequestDto extends CoreEntity {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		example: 'ash',
		description: 'username',
	})
	public username: string;
}
