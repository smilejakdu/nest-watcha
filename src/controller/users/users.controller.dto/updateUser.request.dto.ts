import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/database/entities/core.entity';

export class UpdateUserRequestDto extends CoreEntity {
  @IsString()
  @ApiProperty({
    example: 'dami@gmail.com',
    description: 'email',
  })
  public email: string;

  @IsString()
  @ApiProperty({
    example: 'content',
    description: 'content',
  })
  public contents: string;
}
