import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddChargerCommandHandler, ChargerController, RemoveChargerCommandHandler } from '@prosjekt/nest/charger/data-access/application';
import { ChargerFactory, ChargerTokens } from '@prosjekt/nest/charger/data-access/domain';
import {
  ChargerEntity,
  ChargerRepositoryImpl,
  ChargerUserEntity,
  ChargerUserRepositoryImpl,
  GetAllChargersQueryHandler,
} from '@prosjekt/nest/charger/data-access/infrastructure';

const APPLICATION = [
  AddChargerCommandHandler,
  RemoveChargerCommandHandler
];

const DOMAIN = [
  ChargerFactory,
];

const INFRASTRUCTURE: Provider[] = [
  {
    provide: ChargerTokens.CHARGER_REPOSITORY,
    useClass: ChargerRepositoryImpl,
  },
  {
    provide: ChargerTokens.CHARGER_USER_REPOSITORY,
    useClass: ChargerUserRepositoryImpl,
  },
  GetAllChargersQueryHandler,
];

@Module({
  controllers: [ChargerController],
  providers: [...INFRASTRUCTURE, ...APPLICATION, ...DOMAIN],
  exports: [],
  imports: [TypeOrmModule.forFeature([ChargerEntity, ChargerUserEntity])],
})
export class NestChargerFeatureModule {}
