import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";


@Injectable()
export class JwtGuard extends AuthGuard('jwt') {

  async validate(user: any) {
    return user;
  }

  override handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): TUser {
      if (err || !user) {
        throw err || new UnauthorizedException()
      }

      return user;
  }
}
