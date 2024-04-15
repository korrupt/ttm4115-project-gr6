import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class AuthConfigService {
  constructor(private conf: ConfigService){}

  get JWT_SECRET(): string {
    return this.conf.get('auth.JWT_SECRET')!;
  }

  get CLIENT_ID(): string {
    return this.conf.get('auth.GOOGLE_CLIENT_ID')!;
  }

  get CLIENT_SECRET(): string {
    return this.conf.get('auth.GOOGLE_CLIENT_SECRET')!;
  }
  get CALLBACK_URL(): string {
    return this.conf.get('auth.GOOGLE_CALLBACK_URL')!;
  }
}
