import {ApiProperty} from "@nestjs/swagger";

export class OrderControllerResponseDto {
  @ApiProperty()
  userId: number;
}