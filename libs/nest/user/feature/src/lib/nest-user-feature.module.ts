import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeSlotEntity, UserEntity } from '@prosjekt/nest/entity';
import { RemoveUserReservationCommandHandler, UserController } from '@prosjekt/nest/user/data-access/application';
import { GetUserByIdQueryHandler, GetUserQueryHandler, GetUserReservationsQueryHandler } from '@prosjekt/nest/user/data-access/infrastructure';

const APPLICATION: Provider[] = [
  RemoveUserReservationCommandHandler,
]

const INFRASTRUCTURE: Provider[] = [
  GetUserQueryHandler,
  GetUserByIdQueryHandler,
  GetUserReservationsQueryHandler,
]

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, TimeSlotEntity])
  ],
  controllers: [UserController],
  providers: [
    ...APPLICATION,
    ...INFRASTRUCTURE,
  ]
})
export class NestUserFeatureModule {}
