import { IsNotEmpty } from 'class-validator';

export class TossPayQueryDto {
  @IsNotEmpty()
  paymentKey: string;

  @IsNotEmpty()
  orderId: string;

  @IsNotEmpty()
  amount: number;
}