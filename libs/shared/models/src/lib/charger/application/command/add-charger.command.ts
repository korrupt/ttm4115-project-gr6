import { ChargerType } from '../../charger-type.enum';

export interface AddChargerCommandPropsModel {
  name: string;
  location: [number, number];
  charger_types: ChargerType[];
}

export class AddChargerCommand implements AddChargerCommandPropsModel {
  name!: string;
  charger_types!: ChargerType[];
  location!: [number, number];

  constructor(props: AddChargerCommand) {
    Object.assign(this, props);
  }
}

export type AddChargerCommandResult = AddChargerCommandPropsModel;
