import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import config from '../../config/config';
// import { User } from '../../users/entities/user.entity';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import { AuthConfigService } from '@prosjekt/nest/auth/config';
import { AuthRepository, AuthToken } from '@prosjekt/nest/auth/data-access/domain';


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private config: AuthConfigService,
    @Inject(AuthToken.AUTH_REPOSITORY) private auth: AuthRepository,
  ) {
    super({
      clientID: config.CLIENT_ID,
      clientSecret: config.CLIENT_SECRET,
      callbackURL: config.CALLBACK_URL,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    done(null, profile);
  }
}
