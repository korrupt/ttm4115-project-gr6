import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Charger, ChargerProps, ChargerRepository, ChargerTokens } from "@prosjekt/nest/charger/data-access/domain";
import { AddChargerCommand, AddChargerCommandPropsModel, AddChargerCommandResult } from "@prosjekt/shared/models";


@CommandHandler(AddChargerCommand)
export class AddChargerCommandHandler implements ICommandHandler<AddChargerCommand, AddChargerCommandResult> {
  constructor(@Inject(ChargerTokens.CHARGER_REPOSITORY) private chargerRepository: ChargerRepository){}

  async execute(command: AddChargerCommand): Promise<AddChargerCommandPropsModel> {
    const { charger_types, location, name } = command;

    const id = await this.chargerRepository.newId();

    const charger_props: ChargerProps = {
      id,
      charger_types,
      location,
      name,
      loaded_timeslots: [],
      status: 'DISABLED',
    };

    const charger = new Charger(charger_props);

    charger.create();

    await this.chargerRepository.save(charger);

    charger.commit();

    return charger_props;
  }
}
