import { ICommand } from "@nestjs/cqrs";


export class RemoveChargerCommand implements ICommand {
  constructor(readonly id: string){}
}
