import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddChargerCommandHandler, AddReservationCommandhandler, ChargerController, RemoveChargerCommandHandler, RemoveReservationCommandHandler } from '@prosjekt/nest/charger/data-access/application';
import { ChargerFactory, ChargerTokens } from '@prosjekt/nest/charger/data-access/domain';
import {
  ChargerRepositoryImpl,
  ChargerUserRepositoryImpl,
  GetAllChargersQueryHandler,
  GetChargerByIdQueryHandler,
  GetChargerReservationsQueryHandler,
} from '@prosjekt/nest/charger/data-access/infrastructure';
import { TimeSlotRepository } from '@prosjekt/nest/charger/data-access/infrastructure';
import { ChargerEntity, TimeSlotEntity, UserEntity } from '@prosjekt/nest/entity';

const APPLICATION = [
  AddChargerCommandHandler,
  RemoveChargerCommandHandler,
  AddReservationCommandhandler,
  RemoveReservationCommandHandler
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
  GetChargerReservationsQueryHandler,
  GetChargerByIdQueryHandler,
  TimeSlotRepository,
];

@Module({
  controllers: [ChargerController],
  providers: [...INFRASTRUCTURE, ...APPLICATION, ...DOMAIN],
  exports: [],
  imports: [TypeOrmModule.forFeature([ChargerEntity, UserEntity, TimeSlotEntity])],
})
export class NestChargerFeatureModule {}
