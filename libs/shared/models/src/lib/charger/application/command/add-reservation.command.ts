import { Moment } from "moment-timezone";

export interface AddReservationCommandProps {
  from: Moment;
  to: Moment;
  user_id: string;
  charger_id: string;
}

export type AddReservationCommandResult = void;

export class AddReservationCommand implements AddReservationCommandProps {
  from!: Moment;
  to!: Moment;
  charger_id!: string;
  user_id!: string;

  constructor(props: AddReservationCommandProps) {
    Object.assign(this, props);
  }
}
