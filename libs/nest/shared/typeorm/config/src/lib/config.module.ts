import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { NestSharedTypeormConfigService } from './config.service';
import configuration from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        TYPEORM_HOST: Joi.string().default('localhost'),
        TYPEORM_PORT: Joi.string().default('5432'),
        TYPEORM_USER: Joi.string().required(),
        TYPEORM_PASSWORD: Joi.string().required(),
        TYPEORM_DATABASE: Joi.string().required(),
      })
    })
  ],
  providers: [ConfigService, NestSharedTypeormConfigService],
  exports: [ConfigService, NestSharedTypeormConfigService],
})
export class NestSharedTypeormConfigModule {}
