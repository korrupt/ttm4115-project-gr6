import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectDataSource } from "@nestjs/typeorm";
import { RemoveUserReservationCommand, RemoveUserReservationCommandResult } from "@prosjekt/shared/models";
import { DataSource } from "typeorm";
import { NotFoundException } from "@nestjs/common";
import { TimeSlotEntity } from "@prosjekt/nest/entity";



@CommandHandler(RemoveUserReservationCommand)
export class RemoveUserReservationCommandHandler implements ICommandHandler<RemoveUserReservationCommand, RemoveUserReservationCommandResult> {

  constructor(
    // todo: use tokens
    @InjectDataSource()
    private dataSource: DataSource
  ) {}

  async execute(command: RemoveUserReservationCommand): Promise<RemoveUserReservationCommandResult> {
    const { user_id, reservation_id } = command;

    const timeslot = await this.dataSource.getRepository(TimeSlotEntity)
      .findOneBy({ id: reservation_id, user_id });

    if (!timeslot) {
      throw new NotFoundException();
    }

    await this.dataSource.getRepository(TimeSlotEntity).remove(timeslot);

    return { id: reservation_id };
  }
}
