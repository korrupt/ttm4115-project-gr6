export interface AddReservationCommandPropsModel {
  from: Date;
  to: Date;
}

export type AddReservationCommandResult = void;

export class AddReservationCommand implements AddReservationCommandPropsModel {
  from!: Date;
  to!: Date;

  constructor(props: AddReservationCommandPropsModel) {
    Object.assign(this, props);
  }
}
