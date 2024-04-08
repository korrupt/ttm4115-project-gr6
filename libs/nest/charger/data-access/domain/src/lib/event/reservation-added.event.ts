export class ReservationAddedEvent {
  constructor(
    readonly from: Date,
    readonly to: Date,
    readonly charger_id: string,
    readonly user_id: string,
  ) {}
}
