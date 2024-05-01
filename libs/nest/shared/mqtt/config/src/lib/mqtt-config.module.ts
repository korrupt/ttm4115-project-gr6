import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration';

import * as Joi from 'joi';
import { MqttConfigService } from './config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        MQTT_HOST: Joi.string().default('mosquitto'),
        MQTT_PORT: Joi.number().default(1883),
        MQTT_ID: Joi.string().default('API69')
      })
    })
  ],
  providers: [ConfigService, MqttConfigService],
  exports: [ConfigService, MqttConfigService],
})
export class MqttConfigModule {}
