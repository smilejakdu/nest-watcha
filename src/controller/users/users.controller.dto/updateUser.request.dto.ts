import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/database/entities/core.entity';

export class UpdateUserRequestDto extends CoreEntity {
  @IsString()
  @ApiProperty({
    example: 'dami@gmail.com',
    description: 'email',
  })
  email: string;

  @IsString()
  @ApiProperty({
    example: 'username',
    description: 'username',
  })
  username: string;

  @IsString()
  @ApiProperty({
    example: 'phone',
    description: 'phone',
  })
  phone: string;
}
