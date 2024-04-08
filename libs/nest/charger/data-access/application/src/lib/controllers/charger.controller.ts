import { Body, Controller, Get, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetAllChargersQuery } from '../query';
import { AddChargerDto } from '../dto/add-charger.dto';
import { AddChargerCommand } from '../command';

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
}
