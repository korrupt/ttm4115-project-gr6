import { ChargerType } from "../../charger-type.enum";

export interface AddChargerCommandPropsModel {
  name: string;
  location: [number, number];
  charger_types: ChargerType[];
}


export type AddChargerCommandModel = AddChargerCommandPropsModel;
