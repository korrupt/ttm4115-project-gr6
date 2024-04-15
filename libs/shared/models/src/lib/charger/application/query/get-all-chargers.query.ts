export type GetAllChargersQueryParams = {
  name?: string;
};

export type GetAllChargersQueryResult = {
  id: string;
  name: string;
  location: {
    type: "Point",
    coordinates: [number, number];
  };
}[];

export class GetAllChargersQuery implements GetAllChargersQueryParams {
  constructor(params: GetAllChargersQueryParams) {
    Object.assign(this, params);
  }
}
