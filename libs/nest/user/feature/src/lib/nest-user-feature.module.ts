import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@prosjekt/nest/user/data-access/infrastructure';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity])
  ]
})
export class NestUserFeatureModule {}
