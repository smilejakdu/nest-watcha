import { ApiProperty } from '@nestjs/swagger';

export class SelectHashtagDto {
	@ApiProperty({
		example: ['hashtag','hashtag'],
		description: 'hashtag',
	})
	public hashtag: string[];
}
