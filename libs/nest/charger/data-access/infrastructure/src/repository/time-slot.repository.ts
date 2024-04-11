import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { TimeSlot, TimeSlotFactory } from "@prosjekt/nest/charger/data-access/domain";
import { TimeSlotEntity } from "../entity";

import { Moment } from 'moment-timezone';
import moment = require("moment-timezone");
import { NotFoundException } from "@nestjs/common";



export class TimeSlotRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  public async save(timeslots: TimeSlot[]): Promise<TimeSlot[]> {

    await this.dataSource.getRepository(TimeSlotEntity).save(
      timeslots.filter((e) => !e.deleted).map((t) => this.toPersistence(t))
    );

    await this.dataSource.getRepository(TimeSlotEntity).remove(
      timeslots.filter((e) => !!e.deleted).map((t) => this.toPersistence(t))
    );

    return timeslots;
  }

  public async findFromId(id: string): Promise<TimeSlot> {
    const found = await this.dataSource.getRepository(TimeSlotEntity).findOneBy({ id });

    if (!found) {
      throw new NotFoundException()
    }

    return TimeSlotFactory.reconstitute(this.toDomain(found));
  }

  public async findFromRange(from: Moment, to: Moment, charger_id: string) {
    const found_timeslots = await this.dataSource.getRepository(TimeSlotEntity)
      .createQueryBuilder('t')
      .select([
        't.id as id',
        't.from as from',
        't.to as to',
        't.charger_user_id as charger_user_id',
        't.charger_id as charger_id'
      ])
      .where(
        't.from >= :from AND t.to <= :to', { from: from.toString(), to: to.toString() }
      )
      .andWhere('t.charger_id = :charger_id', { charger_id })
      .getRawMany<TimeSlotEntity>();


    const timeslots = found_timeslots.map((t) => TimeSlotFactory.reconstitute(this.toDomain(t)));

    return timeslots;
  }

  private toPersistence(timeslot: TimeSlot): TimeSlotEntity {
    const from = timeslot.from.utcOffset(0).toISOString();
    const to = timeslot.to.utcOffset(0).toISOString();

    return {
      ...timeslot,
      from,
      to,
    } as TimeSlotEntity;
  }

  private toDomain(entity: TimeSlotEntity): TimeSlot {
    return TimeSlotFactory.reconstitute({
      ...entity,
      from: moment.utc(entity.from),
      to: moment.utc(entity.to),
    })
  }
}
