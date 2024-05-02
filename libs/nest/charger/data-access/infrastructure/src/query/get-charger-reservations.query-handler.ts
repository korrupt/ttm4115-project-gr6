import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InjectDataSource } from "@nestjs/typeorm";
import { GetChargerReservationsQuery, GetChargerReservationsQueryResult,
 } from "@prosjekt/shared/models";
import { DataSource } from "typeorm";

import moment = require("moment-timezone");
import { BadRequestException } from "@nestjs/common";
import { TimeSlotEntity } from "@prosjekt/nest/entity";

const DEFAULT_LOOKAHEAD = [6, 'h'];

@QueryHandler(GetChargerReservationsQuery)
export class GetChargerReservationsQueryHandler implements IQueryHandler<GetChargerReservationsQuery, GetChargerReservationsQueryResult> {
  constructor(@InjectDataSource() private dataSource: DataSource){}

  async execute(query: GetChargerReservationsQuery): Promise<GetChargerReservationsQueryResult> {
    const { charger_id, from, to } = query;

    if (from && to && to <= from) {
      throw new BadRequestException(`'to' must be greater than 'from'`);
    }

    const _from = moment.utc(from ? from : to ? moment.utc(to).subtract(...DEFAULT_LOOKAHEAD) : moment());
    const _to = moment.utc(to ? to : moment(_from).add(...DEFAULT_LOOKAHEAD));

    // only half hours
    const padded_from = _from
      .minutes(Math.round(_from.minutes() / 30) * 30)
      .seconds(0)
      .milliseconds(0);

    const padded_to = _to
      .minutes(Math.round(_to.minutes() / 30) * 30)
      .seconds(0)
      .milliseconds(0);


    const occupied = (await this.dataSource.getRepository(TimeSlotEntity)
      .createQueryBuilder('t')
      .select([
        't.from as from',
        't.to as to',
      ])
      .where('t.charger_id = :charger_id', { charger_id })
      .andWhere('t.from >= :from AND t.to <= :to', { from: padded_from.toISOString(), to: padded_to.toISOString() })
      .getRawMany<{ from: string; to: string }>())
      .map(({ from, to }) => ({ from: moment.utc(from), to: moment.utc(to) }));

    const slots: GetChargerReservationsQueryResult = [];

    const num_slots = Math.abs(padded_to.unix() - padded_from.unix()) / 1800;

    // loop through every half-hour
    for (let i = 0; i <= num_slots; i++) {
      const slot_from = moment(padded_from).add(30 * i, 'm');
      const slot_to   = moment(padded_from).add(30 * (i + 1), 'm');

      const reserved = occupied.some((s) =>
        (slot_from >= s.from && slot_from < s.to)
        || (slot_to > s.from && slot_to < s.to),
      );

      slots.push({
        from: slot_from.toISOString(),
        to: slot_to.toISOString(),
        reserved,
      });
    }


    return slots;
  }
}
