import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import {
  Charger,
  ChargerRepository,
} from '@prosjekt/nest/charger/data-access/domain';
import { DataSource } from 'typeorm';

export class ChargerRepositoryImpl implements ChargerRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async newId(): Promise<string> {
    const [{ id }] = await this.dataSource.query<[{ id: string }]>(
      'SELECT uuid_generate_v4() AS id'
    );

    return id;
  }

  async exists(id: string): Promise<Charger> {
    throw new NotFoundException();
  }

  async findWithTimeSlots(id: string, from: Date, to: Date): Promise<Charger> {
    throw new InternalServerErrorException();
  }

  async remove(charger: Charger): Promise<void> {
    throw new InternalServerErrorException();
  }

  save(charger: Charger): Promise<Charger> {
    throw new InternalServerErrorException();
  }
}
