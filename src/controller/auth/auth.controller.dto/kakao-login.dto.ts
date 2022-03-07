import { IsNotEmpty } from 'class-validator';

export class KakaoLoginDto {
  @IsNotEmpty()
  readonly kakaoId: string;

  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  readonly phone: string;

  @IsNotEmpty()
  readonly email: string;
}