import { Module, Provider } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddChargerCommandHandler, AddReservationCommandhandler, ChargerController, RemoveChargerCommandHandler, RemoveReservationCommandHandler, StartChargingCommandCommandHandler, StopChargingCommand, StopChargingCommandCommandHandler, UpdateChargerStatusCommandHandler } from '@prosjekt/nest/charger/data-access/application';
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
import { MqttConfigModule, MqttConfigService } from '@prosjekt/nest/shared/mqtt/config';
import { MQTT_CLIENT_PROXY_KEY } from '@prosjekt/nest/shared/mqtt/data-access';

const APPLICATION = [
  AddChargerCommandHandler,
  RemoveChargerCommandHandler,
  AddReservationCommandhandler,
  RemoveReservationCommandHandler,
  UpdateChargerStatusCommandHandler,
  StartChargingCommandCommandHandler,
  StopChargingCommandCommandHandler,
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
  providers: [
    ...INFRASTRUCTURE,
    ...APPLICATION,
    ...DOMAIN,
  ],
  exports: [],
  imports: [
    TypeOrmModule.forFeature([ChargerEntity, UserEntity, TimeSlotEntity]),
    MqttConfigModule,
    ClientsModule.registerAsync({
      clients: [
        {
          imports: [MqttConfigModule],
          inject: [MqttConfigService],
          useFactory: (conf: MqttConfigService) => conf.createConfig(),
          name: MQTT_CLIENT_PROXY_KEY
        }
      ]
    })
  ],
})
export class NestChargerFeatureModule {}
