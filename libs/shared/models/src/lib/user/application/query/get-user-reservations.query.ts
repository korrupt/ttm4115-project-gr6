

export type GetUserReservationsQueryProps = {
  user_id: string;
}

export type GetUserReservationsQueryResult = {
  from: string;
  to: string;
  id: string;
}[];

export class GetUserReservationsQuery implements GetUserReservationsQueryProps {
  constructor(readonly user_id: string){}
}
