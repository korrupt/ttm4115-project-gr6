

export type GetAllChargersQueryParams = {};
export type GetAllChargersQueryResult = {
  id: string;
  name: string;
  location: [number, number];
}[];

export class GetAllChargersQuery implements GetAllChargersQueryParams {
  constructor(params: GetAllChargersQueryParams){
    Object.assign(this, params);
  }
}
