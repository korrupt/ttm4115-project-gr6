import { ChargerUser } from './aggregates/charger-user';
import { TimeSlot } from './aggregates/time-slot';
import { Charger, ChargerError } from './charger';
import { ChargerType } from '@prosjekt/shared/models';
// import {  } from "ts-";

describe("Charger", () => {

  it("addReservation()", () => {
    const charger_types: ChargerType[] = [];
    const id = '1';
    const location: [number, number] = [0, 0];
    const user = new ChargerUser({ has_reservation: true, id: '2' });

    const charger = new Charger({ charger_types, id, location, name: 'Charger', occupied_timeslots: [
      new TimeSlot({
        from: new Date("2020-01-01 10:00:00"),
        to: new Date("2020-01-01 11:00:00"),
        user_id: user.id,
        charger_id: id
      }),
      new TimeSlot({
        from: new Date("2020-01-01 11:00:00"),
        to: new Date("2020-01-01 12:00:00"),
        user_id: user.id,
        charger_id: id
      }),
      new TimeSlot({
        from: new Date("2020-01-01 12:00:00"),
        to: new Date("2020-01-01 13:00:00"),
        user_id: user.id,
        charger_id: id
      })
    ]});

    const invalid = () => charger.addReservation(
      new Date("2020-01-01 12:00:00"),
      new Date("2020-01-01 11:00:00"),
      user,
    );

    expect(invalid).toThrow(ChargerError.Invalid);

    const reserved0 = () => charger.addReservation(
      new Date("2020-01-01 11:00:00"),
      new Date("2020-01-01 12:00:00"),
      user,
    );
    const reserved1 = () => charger.addReservation(
      new Date("2020-01-01 11:00:00"),
      new Date("2020-01-01 12:00:00"),
      user,
    );
    const reserved2 = () => charger.addReservation(
      new Date("2020-01-01 12:30:00"),
      new Date("2020-01-01 13:30:00"),
      user,
    );

    expect(reserved0).toThrow(ChargerError.Reserved);
    expect(reserved1).toThrow(ChargerError.Reserved);
    expect(reserved2).toThrow(ChargerError.Reserved);

    const has_reservation = () => charger.addReservation(
      new Date("2020-01-01 13:00:00"),
      new Date("2020-01-01 14:00:00"),
      user,
    );

    expect(has_reservation).toThrow(ChargerError.ExistingReservation);


    const new_user = new ChargerUser({ has_reservation: false, id: '3' });

    const ack = () => charger.addReservation(
      new Date("2020-01-01 13:00:00"),
      new Date("2020-01-01 14:00:00"),
      new_user
    );

    expect(ack).not.toThrow();
  });
});
