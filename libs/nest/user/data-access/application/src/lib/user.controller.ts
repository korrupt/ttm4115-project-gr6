import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { JwtGuard } from "@prosjekt/nest/auth/data-access/application";
import { GetUserByIdQuery, GetUserQuery, GetUserReservationsQuery } from "@prosjekt/shared/models";

@Controller('user')
@UseGuards(JwtGuard)
export class UserController {
  constructor(
    private queryBus: QueryBus
  ){}

  @Get()
  public async getUsers() {
    return this.queryBus.execute(new GetUserQuery({}))
  }

  @Get(':user_id')
  public async getUserByIdQuery(@Param('user_id') user_id: string) {
    return this.queryBus.execute(new GetUserByIdQuery(user_id));
  }

  @Get(':user_id/reservation')
  public async getUserReservations(@Param('user_id') user_id: string) {
    return this.queryBus.execute(new GetUserReservationsQuery(user_id));
  }
}
