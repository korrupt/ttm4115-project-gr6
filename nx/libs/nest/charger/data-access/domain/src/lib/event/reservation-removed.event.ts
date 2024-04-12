import { Moment } from "moment-timezone";


export class ReservationRemovedEvent {
  constructor(
    readonly id: string,
    readonly charger_id: string,
    readonly charger_user_id: string,
    readonly from: Moment,
    readonly to: Moment,
  ){}
}
