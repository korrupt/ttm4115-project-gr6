import { Injectable } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport'
import { AuthConfigService } from "@prosjekt/nest/auth/config";
import { AuthObject } from "@prosjekt/nest/auth/data-access/domain";
import { Strategy, StrategyOptions, ExtractJwt } from 'passport-jwt';



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private conf: AuthConfigService
  ){
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: conf.JWT_SECRET,
    } as StrategyOptions)
  }


  async validate(payload: any): Promise<AuthObject> {
    return { userId: payload.sub };
  }
}
