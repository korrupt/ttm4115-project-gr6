import { AggregateRoot } from '@nestjs/cqrs';
import { ChargerUser } from './aggregates/charger-user';
import { TimeSlot } from './aggregates/time-slot';
import { ChargerType } from '@prosjekt/shared/models';
import { ChargerAddedEvent, ChargerRemovedEvent, ReservationAddedEvent } from './event';
import { Moment } from 'moment-timezone';

export interface ChargerProps {
  readonly id: string;
  name: string;
  location: [number, number];
  charger_types: ChargerType[];
  occupied_timeslots: TimeSlot[];
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
  occupied_timeslots!: TimeSlot[];

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
      this.occupied_timeslots.some(
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

    this.occupied_timeslots.push(slot);

    this.apply(new ReservationAddedEvent(from, to, this.id, user.id));
  }

  removeReservation(from: Moment, to: Moment) {
    if (from >= to) {
      throw ChargerError.Invalid;
    }

    const idx = this.occupied_timeslots.findIndex(
      (slot) => slot.from == from && slot.to == to,
    );

    if (idx > -1) {
      this.charger_types.splice(idx, 1);
    } else {
      throw ChargerError.NotFound;
    }
  }
}
