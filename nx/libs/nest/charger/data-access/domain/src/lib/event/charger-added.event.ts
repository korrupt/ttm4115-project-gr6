import { ChargerType } from '@prosjekt/shared/models';

export class ChargerAddedEvent {
  constructor(
    readonly id: string,
    readonly charger_types: ChargerType[],
    readonly location: [number, number],
  ) {}
}
