import { InjectDataSource } from '@nestjs/typeorm';
import {
  ChargerUserRepository,
  ChargerUser,
} from '@prosjekt/nest/charger/data-access/domain';
import { DataSource } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { UserEntity } from '@prosjekt/nest/entity';

export class ChargerUserRepositoryImpl implements ChargerUserRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  public async findById(id: string): Promise<ChargerUser> {
    const found = await this.dataSource
      .getRepository(UserEntity)
      .findOneBy({ id });

    if (!found) {
      throw new NotFoundException();
    }

    return new ChargerUser({ id, has_reservation: false });
  }
}
