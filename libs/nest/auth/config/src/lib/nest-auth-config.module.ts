import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration';
import * as Joi from 'joi';
import { AuthConfigService } from './config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        AUTH_JWT_SECRET: Joi.string().required(),
        AUTH_GOOGLE_CLIENT_ID: Joi.string().required(),
        AUTH_GOOGLE_CLIENT_SECRET: Joi.string().required(),
        AUTH_GOOGLE_CALLBACK_URL: Joi.string().required(),
      })
    })
  ],
  providers: [ConfigService, AuthConfigService],
  exports: [ConfigService, AuthConfigService]
})
export class NestAuthConfigModule {}
