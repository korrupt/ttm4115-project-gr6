import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetAllChargersQuery } from '../query';
import { AddChargerDto, AddReservationDto, GetChargerReservationsDto } from '../dto';
import { AddChargerCommand, RemoveChargerCommand } from '../command';
import { AddReservationCommand, GetChargerReservationsQuery, RemoveReservationCommand } from '@prosjekt/shared/models';
import { JwtGuard } from '@prosjekt/nest/auth/data-access/application';

@Controller('charger')
@UseGuards(JwtGuard)
export class ChargerController {
  constructor(private queryBus: QueryBus, private commandBus: CommandBus) {}

  @Get()
  public async getAllChargers() {
    return this.queryBus.execute(new GetAllChargersQuery({}));
  }

  @Post()
  public async addCharger(@Body() dto: AddChargerDto) {
    return this.commandBus.execute(new AddChargerCommand({ name: dto.name, charger_types: dto.charger_types, location: dto.location }))
  }

  @Delete(':charger_id')
  public async removeCharger(@Param('charger_id') charger_id: string) {
    return this.commandBus.execute(new RemoveChargerCommand(charger_id));
  }

  @Post(':charger_id/reservation')
  public async addReservation(
    @Param('charger_id') charger_id: string,
    @Body() dto: AddReservationDto
    ) {
      return this.commandBus.execute(new AddReservationCommand({
        ...dto,
        charger_id,
      }));
  }

  @Get(':charger_id/reservation')
  public async getChargerReservations(
      @Param('charger_id') charger_id: string,
      @Query() params: GetChargerReservationsDto,
    ) {
    return this.queryBus.execute(new GetChargerReservationsQuery({ ...params, charger_id }));
  }

  @Delete(':charger_id/reservation/:reservation_id')
  public async removeReservation(@Param('reservation_id') reservation_id: string) {
    return this.commandBus.execute(new RemoveReservationCommand(reservation_id))
  }

}
