import { ChargerType } from "../../charger-type.enum";

export type GetAllChargersQueryParams = {
  name?: string;
};

export type GetAllChargersQueryResult = {
  id: string;
  name: string;
  status: string;
  location: {
    type: "Point",
    coordinates: [number, number];
  };
  charger_types: ChargerType[];
}[];

export class GetAllChargersQuery implements GetAllChargersQueryParams {
  constructor(params: GetAllChargersQueryParams) {
    Object.assign(this, params);
  }
}
