import { Module, Provider } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthConfigService, NestAuthConfigModule } from '@prosjekt/nest/auth/config';
import { AuthController, GoogleGuard, JwtGuard } from '@prosjekt/nest/auth/data-access/application';
import { AuthToken } from '@prosjekt/nest/auth/data-access/domain';
import { AuthEntity, AuthRepositoryImpl, GoogleStrategy, JwtStrategy } from '@prosjekt/nest/auth/data-access/infrastructure';
import { UserEntity } from '@prosjekt/nest/user/data-access/infrastructure';

const DOMAIN: Provider[] = [];
const INFRASTRUCTURE: Provider[] = [
  JwtGuard,
  JwtStrategy,
  GoogleGuard,
  GoogleStrategy,
  {
    provide: AuthToken.AUTH_REPOSITORY,
    useClass: AuthRepositoryImpl
  }
]

@Module({
  imports: [
    NestAuthConfigModule,
    TypeOrmModule.forFeature([AuthEntity, UserEntity]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [NestAuthConfigModule],
      inject: [AuthConfigService],
      useFactory: (conf: AuthConfigService) => ({
        secret: conf.JWT_SECRET,
        signOptions: {
          expiresIn: '30m'
        }
      })
    }),
  ],
  controllers: [AuthController],
  providers: [
    ...DOMAIN,
    ...INFRASTRUCTURE
  ],
  exports: [
    JwtGuard
  ]
})
export class NestAuthFeatureModule {}
