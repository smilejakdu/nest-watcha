import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateHashtagDto {
	@IsString()
	@ApiProperty({
		example: 'hashtag',
		description: 'hashtag',
	})
	public hashtag: string;
}
