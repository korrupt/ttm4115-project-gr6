import { Injectable } from "@nestjs/common";
import { Charger, ChargerProps } from "../charger";
import { EventPublisher } from "@nestjs/cqrs";

export type CreateChargerOptions = ChargerProps;

@Injectable()
export class ChargerFactory {
  constructor(private eventPublisher: EventPublisher){}

  create(options: CreateChargerOptions): Charger {
    return this.eventPublisher.mergeObjectContext(
      new Charger({
        // default options
        ...options,
      })
    )
  }

  reconstitute(charger: Charger): Charger {
    return this.eventPublisher.mergeObjectContext(new Charger({
      id: charger.id,
      name: charger.name,
      charger_types: charger.charger_types,
      location: charger.location,
      occupied_timeslots: charger.occupied_timeslots,
    }))
  }
}
