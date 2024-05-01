import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ChargerRepository, ChargerTokens } from "@prosjekt/nest/charger/data-access/domain";

export class UpdateChargerStatusCommand {
  constructor(readonly charger_id: string, readonly status: string){}
}

@CommandHandler(UpdateChargerStatusCommand)
export class UpdateChargerStatusCommandHandler implements ICommandHandler<UpdateChargerStatusCommand, void> {

  constructor(@Inject(ChargerTokens.CHARGER_REPOSITORY) private charger: ChargerRepository){}


  async execute(command: UpdateChargerStatusCommand): Promise<void> {
    const charger = await this.charger.findById(command.charger_id);

    charger.updateStatus(command.status);

    await this.charger.save(charger);

    charger.commit();
  }
}
