import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NestSharedTypeormConfigModule } from '@prosjekt/nest/shared/typeorm/config';

@Module({
  imports: [NestSharedTypeormConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
