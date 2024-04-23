import { AggregateRoot } from '@nestjs/cqrs';
import { ChargerUser } from './aggregates/charger-user';
import { TimeSlot } from './aggregates/time-slot';
import { ChargerType } from '@prosjekt/shared/models';
import { ChargerAddedEvent, ChargerRemovedEvent, ReservationAddedEvent, ReservationRemovedEvent } from './event';
import { Moment } from 'moment-timezone';

export interface ChargerProps {
  readonly id: string;
  name: string;
  location: [number, number];
  charger_types: ChargerType[];
  loaded_timeslots: TimeSlot[];
  status: string;
}

export enum ChargerError {
  Invalid = 'INVALID',
  Reserved = 'RESERVED',
  NotFound = 'NOT_FOUND',
  ExistingReservation = 'EXISTING_RESERVATION',
}

export function isChargerError(error: unknown): error is ChargerError {
  return Object.values(ChargerError).some((e) => (error as Error).toString() == e);
}

export class Charger extends AggregateRoot implements ChargerProps {
  readonly id!: string;
  name!: string;
  location!: [number, number];
  charger_types!: ChargerType[];
  loaded_timeslots!: TimeSlot[];
  status!: string;

  constructor(props: ChargerProps) {
    super();
    Object.assign(this, props);
  }

  create(): void {
    this.apply(new ChargerAddedEvent(this.id, this.charger_types, this.location));
  }

  remove(): void {
    this.apply(new ChargerRemovedEvent(this.id));
  }

  addReservation(from: Moment, to: Moment, user: ChargerUser) {
    if (from >= to) {
      // invalid
      throw ChargerError.Invalid;
    }

    // check if reserved
    if (
      this.loaded_timeslots.some(
        (slot) =>
          (from >= slot.from && from < slot.to) ||
          (to >= slot.from && to < slot.to),
      )
    ) {
      // reserved
      throw ChargerError.Reserved;
    }

    if (user.has_reservation) {
      throw ChargerError.ExistingReservation;
    }

    const slot = new TimeSlot({
      from,
      to,
      charger_id: this.id,
      charger_user_id: user.id,
    });

    this.loaded_timeslots.push(slot);

    this.apply(new ReservationAddedEvent(from, to, this.id, user.id));
  }

  removeReservation(id: string) {
    const idx = this.loaded_timeslots.findIndex(
      (slot) => slot.id == id,
    );

    if (idx > -1) {
      this.loaded_timeslots[idx].deleted = true;
    } else {
      throw ChargerError.NotFound;
    }

    this.apply(new ReservationRemovedEvent(
      this.loaded_timeslots[idx].id as string,
      this.loaded_timeslots[idx].charger_id,
      this.loaded_timeslots[idx].charger_user_id,
      this.loaded_timeslots[idx].from,
      this.loaded_timeslots[idx].to,
    ));
  }
}
