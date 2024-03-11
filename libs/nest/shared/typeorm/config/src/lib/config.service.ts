import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class NestSharedTypeormConfigService {
  constructor(private config: ConfigService){}

  get HOST(): string {
    return this.config.get('postgres.HOST')!;
  }

  get PORT(): string {
    return this.config.get('postgres.PORT')!;
  }

  get USER(): string {
    return this.config.get('postgres.USER')!;
  }

  get PASSWORD(): string {
    return this.config.get('postgres.PASSWORD')!;
  }

  get DATABASE(): string {
    return this.config.get('postgres.DATABASE')!;
  }

}
