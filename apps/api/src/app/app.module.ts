import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  NestSharedTypeormConfigModule,
  NestSharedTypeormConfigService,
} from '@prosjekt/nest/shared/typeorm/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { NestChargerFeatureModule } from '@prosjekt/nest/charger/feature';

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
      }),
    }),
    CqrsModule.forRoot(),
    NestChargerFeatureModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
