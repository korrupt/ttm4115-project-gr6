

export class ChargerStatusChangedEvent {
  constructor(readonly charger_id: string, readonly status: string){}
}
