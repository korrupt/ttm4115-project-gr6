import { InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { AuthProvider, AuthRepository, AuthUser } from "@prosjekt/nest/auth/data-access/domain";
import { DataSource, EntityManager } from "typeorm";
import { AuthEntity } from "../entity";
import { UserEntity } from "@prosjekt/nest/user/data-access/infrastructure";



export class AuthRepositoryImpl implements AuthRepository {
  constructor(@InjectDataSource() private dataSource: DataSource){}

  findAuthBySub(provider: AuthProvider, sub: string): Promise<AuthUser> {
    throw new NotFoundException();
  }

  async findOrCreate(provider: AuthProvider, sub: string, email: string, name: string): Promise<AuthUser> {
    const exists = await this.dataSource.getRepository(AuthEntity)
      .findOneBy({ provider, sub });

    if (exists) {
      const user = await this.dataSource.getRepository(UserEntity).findOneBy({ id: exists.user_id });

      if (!user) {
        throw new InternalServerErrorException('oi');
      }

      return { id: user.id, email, name }
    }

    return this.dataSource.transaction(async (em: EntityManager) => {

      const user = await em.getRepository(UserEntity).save({ name });
      const auth = await em.getRepository(AuthEntity).save({ email, provider, user_id: user.id, sub });

      return { id: user.id, email, name };
    });
  }
}
