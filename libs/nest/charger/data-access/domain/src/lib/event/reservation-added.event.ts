import { Moment } from "moment-timezone";

export class ReservationAddedEvent {
  constructor(
    readonly from: Moment,
    readonly to: Moment,
    readonly charger_id: string,
    readonly user_id: string,
  ) {}
}
