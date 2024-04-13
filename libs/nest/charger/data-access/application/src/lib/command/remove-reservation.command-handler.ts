import { Inject, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ChargerError, ChargerRepository, ChargerTokens, isChargerError } from "@prosjekt/nest/charger/data-access/domain";
import { RemoveReservationCommand, RemoveReservationCommandResult } from "@prosjekt/shared/models";


@CommandHandler(RemoveReservationCommand)
export class RemoveReservationCommandHandler implements ICommandHandler<RemoveReservationCommand, RemoveReservationCommandResult> {
  constructor(
    @Inject(ChargerTokens.CHARGER_REPOSITORY)
    private chargerRepo: ChargerRepository,
  ) {}

  async execute(command: RemoveReservationCommand): Promise<void> {
    const charger = await this.chargerRepo.findFromTimeslotId(command.id);

    try {
      charger.removeReservation(command.id);
    } catch (err) {
      if (isChargerError(err)) {
        if (err == ChargerError.NotFound) {
          throw new NotFoundException("TimeSlot not found");
        }
      }

      throw err;
    }

    this.chargerRepo.save(charger);

    charger.commit();
  }
}
