

export type RemoveUserReservationCommandResult = { id: string };

export class RemoveUserReservationCommand {
  constructor(readonly user_id: string, readonly reservation_id: string){}
}
