

export type GetChargerReservationsQueryParams = {
  from?: string;
  to?: string;
};

export type GetChargerReservationsQueryResult = {
  from: string;
  to: string;
  reserved: boolean;
}[];

export class GetChargerReservationsQuery implements GetChargerReservationsQueryParams {
  charger_id!: string;
  from?: string;
  to?: string;

  constructor(params: GetChargerReservationsQueryParams & { charger_id: string }) {
    Object.assign(this, params);
  }
}
