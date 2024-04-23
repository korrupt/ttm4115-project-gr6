

export type GetChargerByIdQueryParams = {
  id: string;
};

export type GetChargerByIdQueryResult = {
  id: string;
  name: string;
  status: string;
  location: {
    type: "Point",
    coordinates: [number, number];
  };
};

export class GetChargerByIdQuery implements GetChargerByIdQueryParams {
  id!: string;

  constructor(params: GetChargerByIdQueryParams) {
    Object.assign(this, params);
  }
}
