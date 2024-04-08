import { ICommand } from "@nestjs/cqrs";
import { AddChargerCommandPropsModel, ChargerType } from "@prosjekt/shared/models";


export class AddChargerCommand implements ICommand, AddChargerCommandPropsModel {
  name!: string;
  charger_types!: ChargerType[];
  location!: [number, number];

  constructor(props: AddChargerCommand){
    Object.assign(this, props);
  }
}
