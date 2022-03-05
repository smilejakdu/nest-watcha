import { ApiProperty } from '@nestjs/swagger';

export class SelectHashtagDto {
	@ApiProperty({
		example: 'hashtag',
		description: 'hashtag',
	})
	public hashtag: string[];
}
