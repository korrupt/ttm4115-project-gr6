import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeSlotEntity, UserEntity } from '@prosjekt/nest/entity';
import { UserController } from '@prosjekt/nest/user/data-access/application';
import { GetUserByIdQueryHandler, GetUserQueryHandler } from '@prosjekt/nest/user/data-access/infrastructure';

const INFRASTRUCTURE: Provider[] = [
  GetUserQueryHandler,
  GetUserByIdQueryHandler,
]

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, TimeSlotEntity])
  ],
  controllers: [UserController],
  providers: [
    ...INFRASTRUCTURE,
  ]
})
export class NestUserFeatureModule {}
