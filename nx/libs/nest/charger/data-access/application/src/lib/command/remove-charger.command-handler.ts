import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ChargerRepository, ChargerTokens } from "@prosjekt/nest/charger/data-access/domain";
import { RemoveChargerCommand, RemoveChargerCommandResult } from "@prosjekt/shared/models";


@CommandHandler(RemoveChargerCommand)
export class RemoveChargerCommandHandler implements ICommandHandler<RemoveChargerCommand, RemoveChargerCommandResult> {

  constructor(@Inject(ChargerTokens.CHARGER_REPOSITORY) private chargerRepo: ChargerRepository){}

  async execute(command: RemoveChargerCommand): Promise<void> {
    const { id } = command;

    const charger = await this.chargerRepo.findById(id);

    charger.remove();

    await this.chargerRepo.remove(charger);

    charger.commit();
  }
}
