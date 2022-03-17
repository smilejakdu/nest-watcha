import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class getOrderLogDto {
  @IsString()
  @ApiProperty({
    example: 'orderData',
    description: 'orderData',
  })
  public orderData: string;

  @IsNotEmpty()
  @ApiProperty({
    example: '1',
    description: 'userId',
  })
  public userId: number;

  @IsNotEmpty()
  @ApiProperty({
    example: '1',
    description: 'movieId',
  })
  public movieId: number;
}
