import { ICommand } from "@nestjs/cqrs";
import { AddReservationCommandPropsModel } from "@prosjekt/shared/models";

export class AddReservationCommand implements ICommand, AddReservationCommandPropsModel {
  from!: Date;
  to!: Date;

  constructor(props: AddReservationCommandPropsModel){
    Object.assign(this, props);
  }
}

