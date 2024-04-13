import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class NestSharedTypeormConfigService {
  constructor(private config: ConfigService){}

  get HOST(): string {
    return this.config.get('typeorm.HOST')!;
  }

  get PORT(): number {
    return this.config.get('typeorm.PORT')!;
  }

  get USER(): string {
    return this.config.get('typeorm.USER')!;
  }

  get PASSWORD(): string {
    return this.config.get('typeorm.PASSWORD')!;
  }

  get DATABASE(): string {
    return this.config.get('typeorm.DATABASE')!;
  }

}
