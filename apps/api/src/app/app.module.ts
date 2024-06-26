import { Global, Module, ValidationPipe } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  NestSharedTypeormConfigModule,
  NestSharedTypeormConfigService,
} from '@prosjekt/nest/shared/typeorm/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { NestChargerFeatureModule } from '@prosjekt/nest/charger/feature';
import { APP_PIPE } from '@nestjs/core';
import { NestAuthFeatureModule } from '@prosjekt/nest/auth/feature';
import { NestUserFeatureModule } from '@prosjekt/nest/user/feature';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [NestSharedTypeormConfigModule],
      inject: [NestSharedTypeormConfigService],
      useFactory: (conf: NestSharedTypeormConfigService) => ({
        type: 'postgres',
        host: conf.HOST,
        port: conf.PORT,
        username: conf.USER,
        password: conf.PASSWORD,
        database: conf.DATABASE,
        autoLoadEntities: true,
        synchronize: true,
        useUTC: true,
      }),
    }),
    CqrsModule.forRoot(),
    NestChargerFeatureModule,
    NestAuthFeatureModule,
    NestUserFeatureModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ transform: true, whitelist: true })
    }
  ],
  exports: []
})
export class AppModule {}
