import { BadRequestException, ForbiddenException, Inject, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ChargerError, ChargerRepository, ChargerTokens, ChargerUserRepository, isChargerError } from "@prosjekt/nest/charger/data-access/domain";
import { AddReservationCommand, AddReservationCommandResult } from "@prosjekt/shared/models";
import moment = require("moment-timezone");


@CommandHandler(AddReservationCommand)
export class AddReservationCommandhandler implements ICommandHandler<AddReservationCommand, AddReservationCommandResult> {
  constructor(
    @Inject(ChargerTokens.CHARGER_REPOSITORY) private chargerRepo: ChargerRepository,
    @Inject(ChargerTokens.CHARGER_USER_REPOSITORY) private chargerUserRepo: ChargerUserRepository,
  ){}

  async execute(command: AddReservationCommand): Promise<void> {
    const user = await this.chargerUserRepo.findById(command.user_id);

    const lower_bound = moment(command.from).subtract('2', 'h');
    const upper_bound = moment(command.to).add('2', 'h');

    let charger = await this.chargerRepo.findWithTimeSlots(command.charger_id, lower_bound, upper_bound);

    try {
      charger.addReservation(command.from, command.to, user);
    } catch (err: unknown) {
      if (isChargerError(err)) {
        switch(err) {
          case ChargerError.ExistingReservation:
            throw new ForbiddenException("You already have an existing reservation");
          case ChargerError.Invalid:
            throw new BadRequestException("Invalid request");
          case ChargerError.NotFound:
            throw new NotFoundException();
          case ChargerError.Reserved:
            throw new ForbiddenException("TimeSlot already reserved");
        }
      }

      throw err;
    }

    charger = await this.chargerRepo.save(charger);

    charger.commit();

    return
  }
}
