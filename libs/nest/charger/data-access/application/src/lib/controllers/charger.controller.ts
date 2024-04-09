import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetAllChargersQuery } from '../query';
import { AddChargerDto } from '../dto/add-charger.dto';
import { AddChargerCommand, RemoveChargerCommand } from '../command';

@Controller('charger')
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

}
