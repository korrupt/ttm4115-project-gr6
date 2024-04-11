import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import {
  Charger,
  ChargerFactory,
  ChargerProps,
  ChargerRepository,
  TimeSlot,
  TimeSlotFactory,
} from '@prosjekt/nest/charger/data-access/domain';
import { DataSource } from 'typeorm';
import { ChargerEntity, TimeSlotEntity } from '../entity';
import { TimeSlotRepository } from './time-slot.repository';
import { Moment } from 'moment-timezone';

export class ChargerRepositoryImpl implements ChargerRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private chargerFactory: ChargerFactory,
    private timeslotRepository: TimeSlotRepository,
  ) {}

  async newId(): Promise<string> {
    const [{ id }] = await this.dataSource.query<[{ id: string }]>(
      'SELECT uuid_generate_v4() AS id'
    );

    return id;
  }

  async exists(id: string): Promise<Charger> {
    throw new NotFoundException();
  }

  async findById(id: string): Promise<Charger> {
    const found = await this.dataSource.getRepository(ChargerEntity)
      .findOneBy({ id });

    if (!found) {
      throw new NotFoundException();
    }

    return this.chargerFactory.reconstitute(
      this.toDomain(found)
    );
  }

  async findWithTimeSlots(charger_id: string, from: Moment, to: Moment): Promise<Charger> {
    const charger = await this.findById(charger_id);

    const timeslots = await this.timeslotRepository.findFromRange(from, to, charger_id);

    return this.chargerFactory.reconstitute({
      ...charger,
      occupied_timeslots: timeslots
    })
  }

  async remove(charger: Charger): Promise<void> {
    await this.dataSource.getRepository(ChargerEntity).remove(this.toPersistence(charger));
  }

  async save(charger: Charger): Promise<Charger> {
    await this.timeslotRepository.save(charger.occupied_timeslots);
    await this.dataSource.getRepository(ChargerEntity).save(this.toPersistence(charger));

    return charger;
  }

  private toDomain(charger: ChargerEntity, occupied_timeslots = []): ChargerProps {
    return {
      ...charger,
      location: charger.location.coordinates as [number, number],
      occupied_timeslots
    }
  }

  private toPersistence(charger: Charger): ChargerEntity {
    return {
      id: charger.id,
      name: charger.name,
      charger_types: charger.charger_types,
      location: { type: "Point", coordinates: charger.location }
    }
  }
}
