import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/database/entities/core.entity';
import { Optional } from '@nestjs/common';

export class UserFindRequestDto extends CoreEntity {
	@IsString()
	@Optional()
	@ApiProperty({
		example: 'dami@gmail.com',
		description: 'email',
	})
	public email: string;

	@Optional()
	@ApiProperty({
		example: '3',
		description: 'number',
	})
	public id: number;
}
