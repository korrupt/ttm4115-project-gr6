export interface RemoveReservationCommandProps {
  readonly id: string;
}

export type RemoveReservationCommandResult = void;

export class RemoveReservationCommand implements RemoveReservationCommandProps {
  constructor(readonly id: string) {}
}
