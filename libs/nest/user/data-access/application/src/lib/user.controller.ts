import { Controller, Delete, Get, Param, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { JwtGuard } from "@prosjekt/nest/auth/data-access/application";
import { GetUserByIdQuery, GetUserQuery, GetUserReservationsQuery, RemoveUserReservationCommand } from "@prosjekt/shared/models";

@Controller('user')
@UseGuards(JwtGuard)
export class UserController {
  constructor(
    private queryBus: QueryBus,
    private commandBus: CommandBus,
  ){}

  @Get()
  public async getUsers() {
    return this.queryBus.execute(new GetUserQuery({}))
  }

  @Get(':user_id')
  public async getUserByIdQuery(@Param('user_id') user_id: string) {
    return this.queryBus.execute(new GetUserByIdQuery(user_id));
  }

  @Get(':user_id/reservations')
  public async getUserReservations(@Param('user_id') user_id: string) {
    return this.queryBus.execute(new GetUserReservationsQuery(user_id));
  }

  @Delete(':user_id/reservations/:reservation_id')
  public async removeUserReservation(@Param('user_id') user_id: string, @Param('reservation_id') reservation_id: string) {
    return this.commandBus.execute(new RemoveUserReservationCommand(user_id, reservation_id));
  }
}
