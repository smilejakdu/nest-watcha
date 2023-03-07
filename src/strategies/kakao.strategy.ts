import { Strategy, Profile } from 'passport-kakao';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';

config();

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get('KAKAO_REST_API_KEY'),
      clientSecret: configService.get('KAKAO_CLIENT_SECRET'),
      callbackURL: configService.get('KAKAO_CALLBACK_URL'),
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: any) {
    console.log('kakao profile', profile);
    const kakaoAccount = profile._json.kakao_account;

    const email = kakaoAccount.email || null;
    const nickname = kakaoAccount.profile.nickname;
    const kakaoId = profile._json.id;

    const payload = {
      'id': kakaoId,
      nickname,
      email,
    };

    done(null, payload);
  }
}
